<?php
    if (isset($_GET['file'])) {
        if (unlink('files/' . $_GET['file'])) {
            echo '{"status":"success", "path":"' . $_GET['file'] . '"}';
            exit;
        }
    }

    echo '{"status":"error"}';
    exit;
?>