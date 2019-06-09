package com.template.webserver

import com.template.flow.createIdentity
import com.template.flow.createIdentity.CreateIdentityFlow
import com.template.flows.authIdentity
import com.template.flows.updateIdentity
import com.template.model.AuthRequestModel
import com.template.model.IdentityRequestModel
import com.template.model.UpdateRequestModel
import com.template.schema.IdentitySchemaV1
import com.template.state.IdentityState
import net.corda.core.messaging.startTrackedFlow
import net.corda.core.messaging.vaultQueryBy
import net.corda.core.node.services.Vault
import net.corda.core.node.services.vault.Builder.equal
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.utilities.getOrThrow
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

/**
 * Define your API endpoints here.
 */

@RestController
@RequestMapping("/") // The paths for HTTP requests are relative to this base path.
class Controller(rpc: NodeRPCConnection) {

    companion object {
        private val logger = LoggerFactory.getLogger(RestController::class.java)
    }

    private val proxy = rpc.proxy

    @GetMapping(value = "/templateendpoint", produces = arrayOf("text/plain"))
    private fun templateendpoint(): String {
        return "Define an endpoint here."
    }

//    @CrossOrigin
//    @GetMapping(value = "/all", produces = arrayOf(MediaType.APPLICATION_JSON))
//    private fun debits(): Response {
//        val criteria = QueryCriteria.VaultQueryCriteria(Vault.StateStatus.ALL)
//        val result = proxy.vaultQueryBy<IdentityState>(criteria = criteria).states
//        return Response.status(Response.Status.CREATED).entity(result).build()
//    }


    @CrossOrigin
    @GetMapping(value = "/only", produces = arrayOf(MediaType.APPLICATION_JSON))
    private fun debits(): Response {
        val criteria = QueryCriteria.VaultQueryCriteria(Vault.StateStatus.ALL)
        val result = proxy.vaultQueryBy<IdentityState>(criteria = criteria).states
        return Response.status(Response.Status.CREATED).entity(result).build()
    }

    @CrossOrigin
    @PostMapping(value = ["/create-account"], produces = arrayOf(MediaType.APPLICATION_JSON), consumes = arrayOf(MediaType.APPLICATION_JSON))
    fun createAccount(@RequestBody data: IdentityRequestModel): Response {

        val indexUid = IdentitySchemaV1.PersistentIdentity::uid.equal(data.uid)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)
        val identity = proxy.vaultQueryBy<IdentityState>(criteria).states

        if (identity.isNotEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).entity("UID já existe nesta Org.\n").build()
        }

        return try {

            val signedTx = proxy.startTrackedFlow(createIdentity::CreateIdentityFlow, data.uid, data.pubkey, data.personalData, data.contactData, data.financialData).returnValue.getOrThrow()

            Response.status(Response.Status.CREATED).entity( signedTx.tx.outputs.single() ).build()

        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            logger.error(ex.toString())
            Response.status(Response.Status.BAD_REQUEST).entity(ex.message).build()
        }
    }

    @CrossOrigin
    @PostMapping(value = ["/update-account"], produces = arrayOf(MediaType.APPLICATION_JSON), consumes = arrayOf(MediaType.APPLICATION_JSON))
    fun updateAccount(@RequestBody data: UpdateRequestModel): Response {

        val indexUid = IdentitySchemaV1.PersistentIdentity::uid.equal(data.uid)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)
        val identity = proxy.vaultQueryBy<IdentityState>(criteria).states

        if (identity.isNotEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).entity("UID já existe nesta Org.\n").build()
        }

        return try {

            val signedTx = proxy.startTrackedFlow(updateIdentity::updateIndentityFlow, data.personalData, data.contactData, data.financialData, data.message, data.signature).returnValue.getOrThrow()

            Response.status(Response.Status.CREATED).entity( signedTx.tx.outputs.single() ).build()

        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            logger.error(ex.toString())
            Response.status(Response.Status.BAD_REQUEST).entity(ex.message).build()
        }
    }


    @CrossOrigin
    @PostMapping(value = ["/autorize"], produces = arrayOf(MediaType.APPLICATION_JSON), consumes = arrayOf(MediaType.APPLICATION_JSON))
    fun autorize(@RequestBody data: AuthRequestModel): Response {

        val indexUid = IdentitySchemaV1.PersistentIdentity::uid.equal(data.uid)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)
        val identity = proxy.vaultQueryBy<IdentityState>(criteria).states

        if (identity.isNotEmpty()){
            return try {

                val signedTx = proxy.startTrackedFlow(authIdentity::authIndentityFlow, data.personalDataAuth, data.contactDataAuth, data.financialDataAuth, data.message, data.signature).returnValue.getOrThrow()

                Response.status(Response.Status.CREATED).entity( signedTx.tx.outputs.single() ).build()

            } catch (ex: Throwable) {
                logger.error(ex.message, ex)
                logger.error(ex.toString())
                Response.status(Response.Status.BAD_REQUEST).entity(ex.message).build()
            }
        } else {
            return Response.status(Response.Status.BAD_REQUEST).entity("UID não existe nesta Org.\n").build()
        }


    }
}