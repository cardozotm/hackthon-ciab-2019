package com.template.flow

import co.paralleluniverse.fibers.Suspendable
import com.template.contract.IdentityContract
import net.corda.core.contracts.Command
import net.corda.core.flows.*
import net.corda.core.transactions.SignedTransaction
import net.corda.core.transactions.TransactionBuilder
import net.corda.core.utilities.ProgressTracker
import com.template.model.IdentityModel
import com.template.state.IdentityState
import java.time.Instant

object createIdentity {

    @InitiatingFlow
    @StartableByRPC
    class CreateIdentityFlow(
            val uid : String,
            val pubkey : String,
            val personalData: String,
            val contactData: String,
            val financialData: String
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

        /**
         * The flow logic is encapsulated within the call() method.
         */
        @Suspendable
        override fun call(): SignedTransaction {

            // define progresso
            progressTracker.currentStep = INITIALISING


            // define uma conta
            val account = IdentityModel(
                    orgTo = ourIdentity,
                    entityName = ourIdentity.name.organisation,
                    createTime = Instant.now(),
                    uid = uid,
                    pubkey = pubkey,
                    personalData = personalData,
                    contactData = contactData,
                    financialData =  financialData,
                    personalDataAuth = "false",
                    financialDataAuth = "false",
                    contactDataAuth = "false"
            )

            // cria o state
            val accountState = IdentityState(account)

            // criando o command para validação do contract
            val txCommand = Command(
                IdentityContract.Commands.CreateId(),
                accountState.participants.map { it.owningKey }
            )

            progressTracker.currentStep = BUILDING

            // criando a transação e validando
            val txBuilder = TransactionBuilder(notary)
                .addCommand(txCommand)
                .addOutputState(accountState, IdentityContract::class.java.canonicalName)

            txBuilder.verify(serviceHub)

            progressTracker.currentStep = SIGNING

            // banco assinando a transação
            val signedTx = serviceHub.signInitialTransaction(txBuilder, ourIdentity.owningKey)

            progressTracker.currentStep = FINALISING

            // finalizando
//            return subFlow(
//                FinalityFlow(signedTx,
//                    FINALISING.childProgressTracker()
//                )
//            )

            return subFlow(FinalityFlow(signedTx, emptyList()))


        }
    }

}