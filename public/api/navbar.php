<?php
/**
 * Navbar
 *
 * @package Drustcraft
 * @subpackage API
 * @author James Collins
 * @since 1.0.0
 */
namespace Drustcraft;

require_once 'conf.php';
require_once 'db.php';

$data = [];

$db = db_connect();
if($db) {
    $sql = 'SELECT id, title, url, icon FROM '.DB_PREFIX.'navbar ORDER BY sort';
    foreach( $db->query( $sql ) as $row ) {
        $data[] = $row;
    }
    
    $post = json_decode(file_get_contents("php://input"), true);
    $data[] = Array('id'=>'9', 'title'=>$post['idle'], 'url'=>'', 'icon'=>'');
}

echo json_encode($data);
?>
