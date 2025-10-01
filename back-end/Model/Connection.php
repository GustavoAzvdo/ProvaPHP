<?php

    class Database {
        private static $host = "localhost";
        private static $db_name = "loja_virtual";
        private static $username = "root";
        private static $password = "";
        private static $conn;

        public static function conectar() {
            if (!self::$conn) {
                try {
                    self::$conn = new PDO("mysql:host=" . self::$host . ";dbname=" . self::$db_name, self::$username, self::$password);
                    self::$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                } catch (PDOException $e) {
                    die("Erro de conexão: " . $e->getMessage());
                }
            }
            return self::$conn;
        }
    }

?>