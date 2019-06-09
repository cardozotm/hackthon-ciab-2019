package com.template.state

import com.template.model.IdentityModel
import com.template.schema.IdentitySchemaV1
//import net.corda.core.contracts.BelongsToContract
import net.corda.core.contracts.LinearState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.identity.AbstractParty
import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import net.corda.core.schemas.QueryableState

//@BelongsToContract(IdentityContract::class)
data class IdentityState(val identity: IdentityModel,
                         override val linearId: UniqueIdentifier = UniqueIdentifier()
) : LinearState, QueryableState {

    override val participants: List<AbstractParty> = listOf(identity.entity)

    override fun generateMappedObject(schema: MappedSchema): PersistentState {

        return when (schema) {
            is IdentitySchemaV1 -> IdentitySchemaV1.PersistentIdentity(
                    this.identity.uid)
            else -> throw IllegalArgumentException("Unrecognised schema $schema")
        }

    }

    override fun supportedSchemas(): Iterable<MappedSchema> {
        return listOf(IdentitySchemaV1)
    }

}