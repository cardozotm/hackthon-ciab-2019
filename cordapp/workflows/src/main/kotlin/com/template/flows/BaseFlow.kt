package com.template.flow

import net.corda.core.contracts.StateAndRef
import net.corda.core.flows.FlowException
import net.corda.core.flows.FlowLogic
import net.corda.core.identity.CordaX500Name
import net.corda.core.identity.Party
import net.corda.core.messaging.vaultQueryBy
import net.corda.core.node.services.Vault
import net.corda.core.node.services.queryBy
import net.corda.core.node.services.vault.Builder.equal
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.transactions.SignedTransaction
import com.template.schema.IdentitySchemaV1
import com.template.state.IdentityState

import java.io.File
import java.util.*

abstract class BaseFlow : FlowLogic<SignedTransaction>() {

    val notary get() = serviceHub.networkMapCache.notaryIdentities.firstOrNull() ?: throw FlowException("Notary not found")

    fun getIdentityStateById(id : String) : List<StateAndRef<IdentityState>> {

        val uuid = UUID.fromString(id)

        val query = QueryCriteria.LinearStateQueryCriteria( uuid = listOf(uuid) )

        return serviceHub.vaultService.queryBy<IdentityState>(query).states

    }

    fun getIdentityStateByDocument(document : String) : List<StateAndRef<IdentityState>> {

        val indexDocument = IdentitySchemaV1.PersistentIdentity::uid.equal(document)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexDocument)

        return serviceHub.vaultService.queryBy<IdentityState>(criteria).states
    }



    fun getSysParty() : Party {

        val x500Name = CordaX500Name(organisation = "SYS", locality = "São Paulo", country = "BR")

        return serviceHub.identityService.wellKnownPartyFromX500Name(x500Name) ?:
        throw IllegalArgumentException("Organização para recebimento das taxas não encontrada")

    }

    fun getFlow(key : String) : String? {

        var result : String = "NOT_FOUND"

        try {
            val fis = File("node.properties").inputStream()
            val resource = PropertyResourceBundle(fis)
            result = resource.getString(key)
        } catch (e : Exception){

        }

        return result
    }

}