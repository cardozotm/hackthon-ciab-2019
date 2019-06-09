package com.template.flows

import co.paralleluniverse.fibers.Suspendable
import com.template.contract.IdentityContract
import com.template.flow.BaseFlow
import com.template.model.AuthModel
import com.template.model.IdentityModel
import com.template.schema.IdentitySchemaV1
import com.template.state.AuthState
import com.template.state.IdentityState
import net.corda.core.contracts.Command
import net.corda.core.flows.FinalityFlow
import net.corda.core.flows.FlowLogic
import net.corda.core.flows.InitiatingFlow
import net.corda.core.flows.StartableByRPC
import net.corda.core.identity.Party
import net.corda.core.node.services.queryBy
import net.corda.core.node.services.vault.Builder.equal
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.serialization.CordaSerializable
import net.corda.core.transactions.SignedTransaction
import net.corda.core.transactions.TransactionBuilder
import net.corda.core.utilities.ProgressTracker
import org.bouncycastle.asn1.x500.style.RFC4519Style.uid
import java.time.Instant


object updateIdentity {

    @InitiatingFlow
    @StartableByRPC
    @CordaSerializable
    class updateIndentityFlow(
            private val personalData: String,
            private val contactData: String,
            private val financialData: String,
            private val message: String,
            private val signature: String
    ) : BaseFlow() {

        companion object {

            object INITIALISING : ProgressTracker.Step("Inicializando")
            object BUILDING : ProgressTracker.Step("Construindo")
            object SIGNING : ProgressTracker.Step("Assinando")
            object FINALISING : ProgressTracker.Step("Finalizando") {
                override fun childProgressTracker() = FinalityFlow.tracker()
            }

            fun tracker() = ProgressTracker(
                    INITIALISING,
                    BUILDING,
                    SIGNING,
                    FINALISING
            )
        }

        override val progressTracker = tracker()

        @Suspendable
        override fun call(): SignedTransaction {

            logger.error("FLOW 1")

            // define progresso
            progressTracker.currentStep = INITIALISING

            // obtém a conta de origem para ser consumida
            val indexUid = IdentitySchemaV1.PersistentIdentity::uid.equal(uid)
            val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)
            val oldIdentityStateAndRefList = serviceHub.vaultService.queryBy<IdentityState>(criteria).states

            if (oldIdentityStateAndRefList.isEmpty()) {
                throw Exception("Conta não encontrada")
            }


            val oldIdentityStateAndRef = oldIdentityStateAndRefList.single()
            val oldIdentityState = oldIdentityStateAndRef.state.data


            // define uma conta
            val account = IdentityModel(
                    orgTo = ourIdentity,
                    entityName = ourIdentity.name.organisation,
                    createTime = Instant.now(),
                    uid = oldIdentityState.identity.uid,
                    pubkey = oldIdentityState.identity.pubkey,
                    personalData = personalData,
                    contactData = contactData,
                    financialData =  financialData,
                    personalDataAuth = "false",
                    contactDataAuth = "false",
                    financialDataAuth = "false"
            )

            // cria o state
            val accountState = IdentityState(account)

            // criando o novo state auth
            val auth = AuthModel(entity = ourIdentity, message = message, signature = signature)
            val authState = AuthState(auth)


            // criando o command para validação do contract
            val txCommandDoPayments = Command(
                    IdentityContract.Commands.UpdateId(),
                    accountState.participants.map { it.owningKey }
            )

            progressTracker.currentStep = BUILDING


            val notary = serviceHub.networkMapCache.notaryIdentities.single()


            // criando a transação e validando
            val txBuilder = TransactionBuilder(notary)
                    .addCommand(txCommandDoPayments)
                    .addInputState(oldIdentityStateAndRef)
                    .addOutputState(authState)
                    .addOutputState(accountState, IdentityContract::class.java.canonicalName)

            txBuilder.verify(serviceHub)

            progressTracker.currentStep = SIGNING

            // banco assinando a transação
            val signedTx = serviceHub.signInitialTransaction(txBuilder, ourIdentity.owningKey)

            //sessionTo.sendAndReceive<SignedTransaction>(signedTx)

            progressTracker.currentStep = FINALISING

            // finalizando
            return subFlow(FinalityFlow(signedTx, emptyList()))


        }



    }

}