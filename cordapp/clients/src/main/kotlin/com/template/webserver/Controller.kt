package com.template.webserver

import com.template.flow.createIdentity
import com.template.model.IdentityRequestModel
import com.template.schema.IdentitySchemaV1
import com.template.state.IdentityState
import net.corda.core.messaging.startTrackedFlow
import net.corda.core.messaging.vaultQueryBy
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
    fun updateAccount(@RequestBody data: IdentityRequestModel): Response {

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
}