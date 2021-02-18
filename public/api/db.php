<?php
/**
 * Database Class
 *
 * @package Drustcraft
 * @subpackage API
 * @author James Collins
 * @since 1.0.0
 */
namespace Drustcraft;

function db_connect() {
  try {
    $db = new \PDO(DB_DRIVER, DB_USERNAME, DB_PASSWORD);
    $db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    return $db;
  } catch (\PDOException $e) {
    return null;
  }
}
?>
