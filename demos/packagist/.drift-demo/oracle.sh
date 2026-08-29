#!/usr/bin/env bash
# Native oracle for the PHP fixture.
#
# Against the committed baseline (Monolog 2.9.3) autoloading MailErrorHandler
# resolves its parent class and succeeds. Against the upgraded tree (3.5.0) it
# must fail: Monolog 3 deleted src/Monolog/Handler/SwiftMailerHandler.php, so
# resolving the parent raises a fatal "Class not found" Error.
set -euo pipefail
composer update --no-interaction --no-progress --quiet
php -r '
require "vendor/autoload.php";
$class = new ReflectionClass(\DriftDemo\MailErrorHandler::class);
echo "oracle: handler resolves, parent = ", $class->getParentClass()->getName(), PHP_EOL;
'
