package com.template.contract

import net.corda.core.contracts.CommandData
import net.corda.core.contracts.Contract
import net.corda.core.contracts.requireThat
import net.corda.core.transactions.LedgerTransaction
import com.template.state.IdentityState

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
            else -> throw IllegalArgumentException("Command not found")
        }

    }
            "Apenas uma conta deve ser criada" using (tx.outputs.size == 1)

    // validação para criação de uma nova conta
    private fun verifyCreateId(tx: LedgerTransaction){

        requireThat {
//            "Para criação de conta nenhum estado deve ser consumido" using (tx.inputs.isEmpty())
    //       val out = tx.outputsOfType<IdentityState>().single()
            "Apenas uma conta deve ser criada" using (tx.outputs.size == 1)
//            "Não é permitido valor negativo" using (out.account.balance >= 0.00)
            }

        }


    interface Commands : CommandData {
        class CreateId : Commands
    }

}