package com.template.schema

import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Index
import javax.persistence.Table

/**
 * The family of schemas for IdentityState.
 */

object IdentitySchema

object IdentitySchemaV1 : MappedSchema(
    schemaFamily = IdentitySchema.javaClass,
    version = 1,
    mappedTypes = listOf(PersistentIdentity::class.java)) {
    @Entity
    @Table(name = "identity_states", indexes = [Index(name = "uid_idx", columnList="uid")])
    class PersistentIdentity(

        @Column(name = "uid")
        var uid: String

    ) : PersistentState() {
        // Default constructor required by hibernate.
        constructor(): this(uid = "")
    }
}