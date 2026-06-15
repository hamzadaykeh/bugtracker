<?php
require_once 'config.php';

class ProjectController {
    private $connection;

    public function __construct($db) { 
        $this->connection = $db; 
    }

    public function getAll() {
        $stmt = $this->connection->prepare("SELECT * FROM projects ORDER BY created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $stmt = $this->connection->prepare(
            "INSERT INTO projects (name, description) VALUES (:name, :desc)"
        );
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':desc', $data['description']);
        return $stmt->execute()
            ? ["success" => true, "message" => "Project created"]
            : ["success" => false, "message" => "Failed to create the project"];
    }

    public function delete($id) {
        $stmt = $this->connection->prepare("DELETE FROM projects WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute() ? ["success" => true] : ["success" => false];
    }
}

$db = (new Database())->getConnection();
$ctrl = new ProjectController($db);
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? $input['action'] ?? '';

if ($method === 'GET') echo json_encode($ctrl->getAll());
elseif ($method === 'POST') {
    if ($action === 'create') echo json_encode($ctrl->create($input));
    elseif ($action === 'delete') echo json_encode($ctrl->delete($input['id']));
}
?>