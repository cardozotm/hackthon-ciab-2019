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

object AuthSchema

object AuthSchemaV1 : MappedSchema(
    schemaFamily = AuthSchema.javaClass,
    version = 1,
    mappedTypes = listOf(PersistentAuth::class.java)) {
    @Entity
    @Table(name = "auth_states", indexes = [Index(name = "uid_idx", columnList="uid")])
    class PersistentAuth(

        @Column(name = "uid")
        var uid: String

    ) : PersistentState() {
        // Default constructor required by hibernate.
        constructor(): this(uid = "")
    }
}