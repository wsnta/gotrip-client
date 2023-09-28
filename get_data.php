// get_data.php

// Lấy dữ liệu từ POST request
$keyEncryct = $_POST["keyEncryct"];
$Adt = $_POST["Adt"];
$Chd = $_POST["Chd"];
$Inf = $_POST["Inf"];
$StartPoint = $_POST["StartPoint"];
$EndPoint = $_POST["EndPoint"];
$DepartDate = $_POST["DepartDate"];
$airline = $_POST["airline"];

// Tiến hành xử lý dữ liệu (ví dụ: kiểm tra hợp lệ, truy vấn CSDL, xử lý logic, v.v.)
// ...

// Sau đó, trả về dữ liệu dưới dạng JSON
$data = [
    "Key" => $keyEncryct,
    "ProductKey" => "r1e0q6z8md6akul",
    "Adt" => $Adt,
    "Chd" => $Chd,
    "Inf" => $Inf,
    "ViewMode" => false,
    "ListFlight" => [
        [
            "StartPoint" => $StartPoint,
            "EndPoint" => $EndPoint,
            "DepartDate" => $DepartDate,
            "Airline" => $airline,
        ],
    ],
];

// Đảm bảo gửi dữ liệu dưới định dạng JSON
header('Content-Type: application/json');
echo json_encode($data);
