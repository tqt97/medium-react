<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case USER = 'user';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::USER => 'User',
        };
    }

    public function value(): string
    {
        return match ($this) {
            self::ADMIN => 'admin',
            self::USER => 'user',
        };
    }
}
