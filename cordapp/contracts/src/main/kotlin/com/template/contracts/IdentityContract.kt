package com.template.contract

import com.template.state.AuthState
import com.template.state.IdentityState
import net.corda.core.contracts.CommandData
import net.corda.core.contracts.Contract
import net.corda.core.contracts.requireThat
import net.corda.core.crypto.Crypto
import net.corda.core.transactions.LedgerTransaction
import org.bouncycastle.util.encoders.Hex
import java.security.PublicKey
import java.util.*

class IdentityContract : Contract {

    /*
    companion object {
        @JvmStatic
        val ACCOUNT_CONTRACT_ID = "com.rtm.poc.contract.IdentityContract"
    }
    */

    override fun verify(tx: LedgerTransaction) {

        val command = tx.commandsOfType<Commands>().single()

        when (command.value) {
            is Commands.CreateId -> verifyCreateId(tx)
            is Commands.UpdateId -> verifyUpdateId(tx)

            else -> throw IllegalArgumentException("Command not found")
        }

    }

    // validação para criação de uma nova conta
    private fun verifyCreateId(tx: LedgerTransaction){

        requireThat {
            "Apenas uma conta deve ser criada" using (tx.outputs.size == 1)
            }

        }

    // validação para update de uma nova conta
    private fun verifyUpdateId(tx: LedgerTransaction){

        requireThat {

            val out = tx.outputsOfType<IdentityState>().single()
            // val imp = tx.inputsOfType<AuthState>().single()

            val pubKey = getKey(out.identity.pubkey.toByteArray())
            val signature = Hex.decode(out.identity.signature)

            val b = Crypto.doVerify(Crypto.RSA_SHA256, pubKey, signature , out.identity.message.toByteArray())

            "Apenas uma conta deve ser criada" using (tx.outputs.size == 1)

            "Signature verification failed" using(b)

        }

    }

    fun getKey(publicKey: ByteArray): PublicKey {
        val publicBytes =  Base64.getDecoder().decode(publicKey)
        return Crypto.decodePublicKey(Crypto.RSA_SHA256, publicBytes)
    }

    interface Commands : CommandData {
        class CreateId : Commands
        class UpdateId: Commands


    }

}