#noname


send
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'http://localhost:3000/send-message',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_POSTFIELDS => 'sender=123&number=628xxxx&message=hello%20word',
  CURLOPT_HTTPHEADER => array(
    'authorization: ebca0abf14bbb0cfdca5fd8a367d40e512ec4c921510d64db95775183865bbef6ed016527e1297e6d31b422209359803066b6932dcb172d9879f382b47f88204',
    'Content-Type: application/x-www-form-urlencoded'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;



https://documenter.getpostman.com/view/18452404/2s9Xy3tBvx