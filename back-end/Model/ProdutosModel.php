<?php

require_once __DIR__ . '/Connection.php';

class ProdutosModel
{
    private int $ID;
    private string $nome;
    private float $valor;
    private int $estoque;
    private ?PDO $con = null; 

    public function __construct(int $ID, string $nome, float $valor, int $estoque)
    {
        $this->ID = $ID;
        $this->nome = $nome;
        $this->valor = $valor;
        $this->estoque = $estoque;
    }

    // Seus Getters e Setters estão perfeitos
    public function getId(): int { return $this->ID; }
    public function getNome(): string { return $this->nome; }
    public function getValor(): float { return $this->valor; }
    public function getEstoque(): int { return $this->estoque; }
    public function setNome(string $nome): void { $this->nome = $nome; }
    public function setValor(float $valor): void { $this->valor = $valor; }
    public function setEstoque(int $estoque): void { $this->estoque = $estoque; }

    public function salvar(): bool
    {
        try {
            $this->con = Database::conectar();
            $sql = "INSERT INTO produtos (nome, valor, estoque) VALUES (:nome, :valor, :estoque)";
            $stmt = $this->con->prepare($sql);
            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":valor", $this->valor);
            $stmt->bindParam(":estoque", $this->estoque);

            if ($stmt->execute()) {
                $this->ID = (int)$this->con->lastInsertId();
                return true;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Erro ao salvar produto: " . $e->getMessage());
            return false;
        }
    }

    public static function buscarPorId(int $ID): ?ProdutosModel
    {
        try {
            $con = Database::conectar();
            $sql = "SELECT * FROM produtos WHERE ID = :ID";
            $stmt = $con->prepare($sql);
            // CORREÇÃO 1: O placeholder deve ser ':ID' (maiúsculo), igual ao SQL.
            $stmt->bindParam(":ID", $ID);
            $stmt->execute();
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($dados) {
                return new self(
                    (int)$dados['ID'],
                    $dados['nome'],
                    (float)$dados['valor'],
                    (int)$dados['estoque']
                );
            }
            return null;
        } catch (PDOException $e) {
            error_log("Erro ao buscar produto por ID: " . $e->getMessage());
            return null;
        }
    }

    public function atualizar(): bool
    {
        try {
            // CORREÇÃO 2: A conexão precisa ser estabelecida dentro do método.
            $this->con = Database::conectar();
            $sql = "UPDATE produtos SET nome = :nome, valor = :valor, estoque = :estoque WHERE ID = :ID";
            $stmt = $this->con->prepare($sql);
            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":valor", $this->valor);
            $stmt->bindParam(":estoque", $this->estoque);
            // CORREÇÃO 1: O placeholder deve ser ':ID' (maiúsculo).
            $stmt->bindParam(":ID", $this->ID);

            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro ao atualizar produto: " . $e->getMessage());
            return false;
        }
    }

    public function deletar(): bool
    {
        try {
           
            $this->con = Database::conectar();
            $sql = "DELETE FROM produtos WHERE ID = :ID";
            $stmt = $this->con->prepare($sql);
            $stmt->bindParam(":ID", $this->ID);
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Erro ao deletar produto: " . $e->getMessage());
            return false;
        }
    }

      public static function deletarPorId(int $id): bool
    {
        try {
            $con = Database::conectar();
            $sql = "DELETE FROM produtos WHERE ID = :ID";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(":ID", $id);
            return $stmt->execute() && $stmt->rowCount() > 0;
            
        } catch (PDOException $e) {
            error_log("Erro ao deletar produto por ID: " . $e->getMessage());
            return false;
        }
    }

    public static function buscarTodos(): array
    {
        try {
            $con = Database::conectar();
            $sql = "SELECT * FROM produtos";
            $stmt = $con->query($sql);
            $resultados = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $produto = new ProdutosModel(
                    (int)$row['ID'],
                    $row['nome'],
                    (float)$row['valor'],
                    (int)$row['estoque']
                );
                $resultados[] = $produto;
            }

            return $resultados;
        } catch (PDOException $e) {
            error_log("Erro ao buscar produtos: " . $e->getMessage());
            return [];
        }
    }
}