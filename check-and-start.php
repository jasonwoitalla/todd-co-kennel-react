<?php
// Define the path to your Next.js app and its start command
$appPath = "public_html/todd-co-kennel-react";
$startCommand = "nohup npm run start";

// Check if the app is running
exec("pgrep -f \"$startCommand\"", $output, $returnCode);

if ($returnCode !== 0) {
    // If not running, start the app
    exec("cd \"$appPath\" && $startCommand > /dev/null 2>&1 &");
}
?>

