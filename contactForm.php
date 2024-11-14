<?php
// Server and database configuration
$host = "localhost"; // Typically 'localhost'
$dbname = "merricks_living_contact"; // Database name
$username = "khush"; // Database username
$password = "Khush@3160"; // Database password

// Server information
$domain = $_SERVER['SERVER_NAME'];
$IPaddress = $_SERVER['REMOTE_ADDR'];
$date = date('d/m/Y');
$time = date('H:i:s');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Data from the form
    $name = str_replace(array("\r", "\n"), array(" ", " "), strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Validation
    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    // Email settings
    $recipientEmail = "workforkhush8@gmail.com";
    $subject = 'New message from your site';
    $emailHeader = "From: $name <$email>\r\nReply-To: $email\r\n";
    $emailContent = "Name: $name\nEmail: $email\n\nMessage:\n$message\n\n---\nSent from $domain\nIP Address: $IPaddress\nDate: $date, Time: $time";

    // Save to database
    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $conn->prepare("INSERT INTO contacts (name, email, message) VALUES (:name, :email, :message)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':message', $message);

        $stmt->execute();
    } catch (PDOException $e) {
        http_response_code(500);
        echo "Error saving data to database: " . $e->getMessage();
        exit;
    }

    // Send email
    $success = mail($recipientEmail, $subject, $emailContent, $emailHeader);

    if ($success) {
        http_response_code(200);
        echo "<h2 style='color:green;text-align:center;margin-top:4rem;'>Thank You! Your message has been sent and saved.</h2>";
        header("refresh:5;url=index.html");
    } else {
        http_response_code(500);
        echo "<h2 style='color:red;text-align:center;margin-top:4rem;'>Oops! Something went wrong, we couldn't send your message.</h2>";
        header("refresh:5;url=contact.html");
    }
} else {
    http_response_code(403);
    echo "<h2 style='color:red;text-align:center;margin-top:4rem;'>There was a problem with your submission, please try again.</h2>";
}
?>
