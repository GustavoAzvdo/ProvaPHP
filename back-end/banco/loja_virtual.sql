CREATE DATABASE IF NOT EXISTS loja_virtual;

USE loja_virtual;

CREATE TABLE IF NOT EXISTS produtos (
    ID INT PRIMARY KEY AUTO_INCREMENT, 
    nome VARCHAR(255) NOT NULL,        
    valor DECIMAL(10, 2) NOT NULL,     
    estoque INT NOT NULL DEFAULT 0     
);

CREATE TABLE IF NOT EXISTS vendas (
    ID INT PRIMARY KEY AUTO_INCREMENT,                        
    ID_produto INT,                                            
    quantidade INT NOT NULL,                                   
    valor_total DECIMAL(10, 2) NOT NULL,                      
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,            
    FOREIGN KEY (ID_produto) REFERENCES produtos(ID)           
);