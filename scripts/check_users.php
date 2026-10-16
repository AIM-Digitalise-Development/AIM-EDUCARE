<?php
require 'C:/xampp/htdocs/aimeducare/vendor/autoload.php';
$app = require 'C:/xampp/htdocs/aimeducare/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
echo json_encode(App\Models\User::all(['id', 'name', 'email', 'phone', 'role'])->toArray(), JSON_PRETTY_PRINT);