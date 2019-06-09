package com.template.state

import com.template.contract.IdentityContract
import com.template.model.AuthModel
import com.template.schema.AuthSchemaV1
import com.template.schema.IdentitySchemaV1
import net.corda.core.contracts.BelongsToContract
import net.corda.core.contracts.LinearState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.identity.AbstractParty
import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import net.corda.core.schemas.QueryableState

@BelongsToContract(IdentityContract::class)
data class AuthState(val auth: AuthModel,
                     override val linearId: UniqueIdentifier = UniqueIdentifier()
) : LinearState, QueryableState {

    override val participants: List<AbstractParty> = listOf(auth.entity)

    override fun generateMappedObject(schema: MappedSchema): PersistentState {

        return when (schema) {
            is AuthSchemaV1 -> AuthSchemaV1.PersistentAuth(
                    this.auth.message)
            else -> throw IllegalArgumentException("Unrecognised schema $schema")
        }

    }

    override fun supportedSchemas(): Iterable<MappedSchema> {
        return listOf(IdentitySchemaV1)
    }

}