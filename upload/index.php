<?php
    $allowed = array('png', 'jpg', 'gif', 'pdf');

    if (isset($_FILES)) {
        foreach ($_FILES as $value) {
            $extension = pathinfo($value['name'][0], PATHINFO_EXTENSION);

            if (!in_array(strtolower($extension), $allowed)) {
                echo '{"status":"error", "text": "ошибка загрузки"}';
                exit;
            }

            if (move_uploaded_file($value['tmp_name'][0], 'files/' . $value['name'][0])) {
                echo '{"status":"success", "path":"' . $value['name'][0] . '", "ext":"' . $extension . '", "size":"' . $value['size'][0] / 1024 / 1024 . '", "size":"' . $value['size'][0] / 1024 / 1024 . '", "url":"upload/files/' . $value['name'][0] . '"}';
                exit;
            }
        }
    }

    echo '{"status":"error"}';
    exit;
?>