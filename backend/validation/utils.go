package validation

import (
	"errors"

	"gorm.io/gorm"
)

// Checks if the given error is a unique constraint violation
func IsUniqueConstraintError(err error) bool {
	return errors.Is(err, gorm.ErrDuplicatedKey)
}

// Checks if the given ID is zero (invalid/unset)
func IsIDZero(id uint) bool {
	return id == 0
}

// Checks if the given nullable ID is nil or zero (invalid/unset)
func IsNullableIDInvalid(id *uint) bool {
	return id == nil || *id == 0
}

// Checks if the given error is a foreign key constraint violation
func IsForeignKeyConstraintError(err error) bool {
	return errors.Is(err, gorm.ErrForeignKeyViolated)
}
