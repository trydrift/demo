<?php

namespace DriftDemo;

use Monolog\Handler\SwiftMailerHandler;

/**
 * Sends error-level log records out by email.
 *
 * Monolog 2 ships SwiftMailerHandler, so a project only has to subclass it to
 * adjust the message it builds.
 */
class MailErrorHandler extends SwiftMailerHandler
{
}
