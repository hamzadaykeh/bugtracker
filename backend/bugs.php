<?php
require_once 'config.php';

class BugController {
    private $connection;

    public function __construct($db) { 
        $this->connection = $db; 
    }

    private function generateTicket() {
        return 'TKT-' . strtoupper(uniqid());
    }

    public function create($data) {
        $ticket = $this->generateTicket();
        $stmt = $this->connection->prepare(
            "INSERT INTO bugs (ticket_number, project_id, customer_id, error_category, error_details, screenshot, due_date, status)
             VALUES (:ticket, :project, :customer, :category, :details, :screenshot, :due, 'open')"
        );
        $stmt->bindParam(':ticket', $ticket);
        $stmt->bindParam(':project', $data['project_id']);
        $stmt->bindParam(':customer', $data['customer_id']);
        $stmt->bindParam(':category', $data['error_category']);
        $stmt->bindParam(':details', $data['error_details']);
        $stmt->bindParam(':screenshot', $data['screenshot']);
        $stmt->bindParam(':due', $data['due_date']);

        if ($stmt->execute()) {
            $bug_id = $this->connection->lastInsertId();
            $this->logFlow($bug_id, "Bug reported by customer", $data['customer_id'], "New bug created");
            return ["success" => true, "ticket_number" => $ticket];
        }
        return ["success" => false, "message" => "Failed to create the bug"];
    }

    public function getAll() {
        $stmt = $this->connection->prepare(
            "SELECT b.*, p.name as project_name, u.username as customer_name
             FROM bugs b
             LEFT JOIN projects p ON b.project_id = p.id
             LEFT JOIN users u ON b.customer_id = u.id
             ORDER BY b.created_at DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByCustomer($customer_id) {
        $stmt = $this->connection->prepare(
            "SELECT b.*, p.name as project_name
             FROM bugs b
             LEFT JOIN projects p ON b.project_id = p.id
             WHERE b.customer_id = :cid
             ORDER BY b.created_at DESC"
        );
        $stmt->bindParam(':cid', $customer_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByStaff($staff_id) {
        $stmt = $this->connection->prepare(
            "SELECT b.*, p.name as project_name, u.username as customer_name, ba.message as assign_message
             FROM bugs b
             LEFT JOIN projects p ON b.project_id = p.id
             LEFT JOIN users u ON b.customer_id = u.id
             INNER JOIN bug_assignments ba ON ba.bug_id = b.id
             WHERE ba.staff_id = :sid
             ORDER BY ba.assigned_at DESC"
        );
        $stmt->bindParam(':sid', $staff_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByTicket($ticket) {
        $stmt = $this->connection->prepare(
            "SELECT b.*, p.name as project_name, u.username as customer_name
             FROM bugs b
             LEFT JOIN projects p ON b.project_id = p.id
             LEFT JOIN users u ON b.customer_id = u.id
             WHERE b.ticket_number = :ticket"
        );
        $stmt->bindParam(':ticket', $ticket);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function assignToStaff($data) {
        $stmt = $this->connection->prepare(
            "INSERT INTO bug_assignments (bug_id, staff_id, assigned_by, message) VALUES (:bug,:staff,:by,:msg)"
        );
        $stmt->bindParam(':bug', $data['bug_id']);
        $stmt->bindParam(':staff', $data['staff_id']);
        $stmt->bindParam(':by', $data['assigned_by']);
        $stmt->bindParam(':msg', $data['message']);

        if ($stmt->execute()) {
            $upd = $this->connection->prepare("UPDATE bugs SET status='assigned' WHERE id=:id");
            $upd->bindParam(':id', $data['bug_id']);
            $upd->execute();
            $this->logFlow($data['bug_id'], "Bug assigned to staff", $data['assigned_by'], $data['message']);
            return ["success" => true, "message" => "Bug assigned"];
        }
        return ["success" => false, "message" => "Assignment failed"];
    }

    public function updateStatus($bug_id, $status, $user_id) {
        $stmt = $this->connection->prepare("UPDATE bugs SET status=:s WHERE id=:id");
        $stmt->bindParam(':s', $status);
        $stmt->bindParam(':id', $bug_id);
        if ($stmt->execute()) {
            $this->logFlow($bug_id, "Status updated to: $status", $user_id, "");
            return ["success" => true];
        }
        return ["success" => false];
    }

    public function getFlow($bug_id) {
        $stmt = $this->connection->prepare(
            "SELECT bf.*, u.username as performed_by_name
             FROM bug_flow bf
             LEFT JOIN users u ON bf.performed_by = u.id
             WHERE bf.bug_id = :bug_id
             ORDER BY bf.created_at ASC"
        );
        $stmt->bindParam(':bug_id', $bug_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getMessages($bug_id) {
        $stmt = $this->connection->prepare(
            "SELECT m.*, u.username as sender_name, r.username as receiver_name
             FROM messages m
             LEFT JOIN users u ON m.sender_id = u.id
             LEFT JOIN users r ON m.receiver_id = r.id
             WHERE m.bug_id = :bug_id
             ORDER BY m.sent_at ASC"
        );
        $stmt->bindParam(':bug_id', $bug_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function sendMessage($data) {
        $stmt = $this->connection->prepare(
            "INSERT INTO messages (bug_id, sender_id, receiver_id, message) VALUES (:bug,:from,:to,:msg)"
        );
        $stmt->bindParam(':bug', $data['bug_id']);
        $stmt->bindParam(':from', $data['sender_id']);
        $stmt->bindParam(':to', $data['receiver_id']);
        $stmt->bindParam(':msg', $data['message']);

        if ($stmt->execute()) {
            $this->logFlow($data['bug_id'], "Message sent", $data['sender_id'], $data['message']);
            return ["success" => true, "message" => "Message sent"];
        }
        return ["success" => false];
    }

    private function logFlow($bug_id, $action, $user_id, $notes) {
        $stmt = $this->connection->prepare(
            "INSERT INTO bug_flow (bug_id, action, performed_by, notes) VALUES (:bug,:action,:by,:notes)"
        );
        $stmt->bindParam(':bug', $bug_id);
        $stmt->bindParam(':action', $action);
        $stmt->bindParam(':by', $user_id);
        $stmt->bindParam(':notes', $notes);
        $stmt->execute();
    }
}

$db = (new Database())->getConnection();
$ctrl = new BugController($db);
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? $input['action'] ?? '';

if ($method === 'GET') {
    if ($action === 'all') echo json_encode($ctrl->getAll());
    elseif ($action === 'by_customer') echo json_encode($ctrl->getByCustomer($_GET['id']));
    elseif ($action === 'by_staff') echo json_encode($ctrl->getByStaff($_GET['id']));
    elseif ($action === 'by_ticket') echo json_encode($ctrl->getByTicket($_GET['ticket']));
    elseif ($action === 'flow') echo json_encode($ctrl->getFlow($_GET['bug_id']));
    elseif ($action === 'messages') echo json_encode($ctrl->getMessages($_GET['bug_id']));
} elseif ($method === 'POST') {
    if ($action === 'create') echo json_encode($ctrl->create($input));
    elseif ($action === 'assign') echo json_encode($ctrl->assignToStaff($input));
    elseif ($action === 'update_status') echo json_encode($ctrl->updateStatus($input['bug_id'], $input['status'], $input['user_id']));
    elseif ($action === 'send_message') echo json_encode($ctrl->sendMessage($input));
}
?>