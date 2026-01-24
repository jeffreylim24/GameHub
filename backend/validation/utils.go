package validation

import (
	"errors"

	"gorm.io/gorm"
)

// IsUniqueConstraintError reports whether err is a unique constraint violation.
func IsUniqueConstraintError(err error) bool {
	return errors.Is(err, gorm.ErrDuplicatedKey)
}

// IsIDZero reports whether id is zero.
func IsIDZero(id uint) bool {
	return id == 0
}

// IsNullableIDInvalid reports whether id is nil or zero.
func IsNullableIDInvalid(id *uint) bool {
	return id == nil || *id == 0
}

// IsForeignKeyConstraintError reports whether err is a foreign key constraint violation.
func IsForeignKeyConstraintError(err error) bool {
	return errors.Is(err, gorm.ErrForeignKeyViolated)
}
