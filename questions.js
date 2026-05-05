// Arquivo de perguntas focado em Redes e Internet (Treinamento Provedor N1/N2)

const gameConfig = {
    prizes: [
        "1.000 PONTOS", "2.000 PONTOS", "3.000 PONTOS", "4.000 PONTOS", "5.000 PONTOS",
        "10.000 PONTOS", "20.000 PONTOS", "30.000 PONTOS", "40.000 PONTOS", "50.000 PONTOS",
        "100.000 PONTOS", "200.000 PONTOS", "300.000 PONTOS", "400.000 PONTOS", "500.000 PONTOS",
        "1 MILHÃO DE PONTOS"
    ]
};

const questions = [
    {
        question: "O que significa a sigla WAN?",
        options: ["Wireless Area Network", "Wide Area Network", "Web Access Node", "Wifi Authentication Network"],
        answer: 1
    },
    {
        question: "Qual comando é usado para testar a latência e conectividade entre dois pontos?",
        options: ["ipconfig", "get-ip", "ping", "tracert"],
        answer: 2
    },
    {
        question: "Qual protocolo é responsável por atribuir endereços IP automaticamente na rede?",
        options: ["DNS", "DHCP", "HTTP", "PPPoE"],
        answer: 1
    },
    {
        question: "Em uma rede de fibra óptica (GPON), o que significa a sigla ONU?",
        options: ["Optical Network Unit", "Operation Network Utility", "Only Network User", "Output Node Unit"],
        answer: 0
    },
    {
        question: "Qual é o IP de loopback (localhost) padrão em redes IPv4?",
        options: ["192.168.1.1", "8.8.8.8", "127.0.0.1", "10.0.0.1"],
        answer: 2
    },
    {
        question: "Qual a função do DNS em uma rede de computadores?",
        options: ["Criptografar dados", "Traduzir nomes (URLs) em IPs", "Aumentar a velocidade do Wi-Fi", "Gerenciar senhas de roteador"],
        answer: 1
    },
    {
        question: "Sobre as frequências Wi-Fi, qual a principal vantagem do 5GHz em relação ao 2.4GHz?",
        options: ["Maior alcance de sinal", "Atravessa melhor as paredes", "Maior velocidade e menor interferência", "Funciona em aparelhos muito antigos"],
        answer: 2
    },
    {
        question: "Qual protocolo é amplamente utilizado por provedores para autenticação de clientes banda larga?",
        options: ["FTP", "SMTP", "PPPoE", "ICMP"],
        answer: 2
    },
    {
        question: "O que acontece fisicamente na fibra óptica para causar 'Atenuação'?",
        options: ["Aumento da voltagem", "Perda de potência do sinal de luz", "Superaquecimento do cabo", "Mudança na cor do laser"],
        answer: 1
    },
    {
        question: "Em qual camada do Modelo OSI opera o protocolo IP e os Roteadores?",
        options: ["Camada 1 (Física)", "Camada 2 (Enlace)", "Camada 3 (Rede)", "Camada 4 (Transporte)"],
        answer: 2
    },
    {
        question: "Qual o valor médio considerado ideal para o sinal de recepção (RX) em uma ONU?",
        options: ["Entre -10 e -14 dBm", "Entre -15 e -25 dBm", "Entre -30 e -40 dBm", "Acima de 0 dBm"],
        answer: 1
    },
    {
        question: "O que o comando 'tracert' (ou traceroute) mostra ao suporte técnico?",
        options: ["A velocidade de download real", "O caminho e os saltos (roteadores) até o destino", "A senha do Wi-Fi do cliente", "O modelo do roteador do cliente"],
        answer: 1
    },
    {
        question: "O que é um endereço MAC?",
        options: ["Um endereço IP variável", "O endereço físico único da placa de rede", "O nome do usuário no Windows", "A marca do computador"],
        answer: 1
    },
    {
        question: "Qual porta é utilizada por padrão pelo protocolo HTTPS?",
        options: ["80", "21", "443", "8080"],
        answer: 2
    },
    {
        question: "Qual técnica é usada para permitir que vários dispositivos em uma rede privada usem um único IP público?",
        options: ["NAT", "VLAN", "Firewall", "Bridge"],
        answer: 0
    }
];
