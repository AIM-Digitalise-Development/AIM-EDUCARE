<?php
require 'C:/xampp/htdocs/aimeducare/vendor/autoload.php';
$app = require 'C:/xampp/htdocs/aimeducare/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = new \App\Http\Requests\Admin\SubAdminRequest();
$rules = $request->rules();

$testPayload = [
    'name' => 'Sub Admin 1',
    'email' => 'admin@aimeducare.test', // e.g. existing email!
    'phone' => null,
    'password' => '123', // e.g. short password!
    'permissions' => ['upload_questions']
];

$validator = \Illuminate\Support\Facades\Validator::make($testPayload, $rules);
if ($validator->fails()) {
    echo "Validation failed with errors:\n";
    print_r($validator->errors()->toArray());
} else {
    echo "Validation passed!\n";
}