const opcoesDeFormato = ["string", "CPF", "data_completa"];
// Colocar depois
// "int", "double", "data"

document.getElementById("numLinhas").addEventListener("input", () => {
    const numLinhasEntrada = document.getElementById("numLinhas");
    const numLinhas = parseInt(numLinhasEntrada.value, 10);

    if (numLinhas < 1) {
        numLinhasEntrada.value = 1;
    } else if (numLinhas > 100) {
        numLinhasEntrada.value = 100;
    }

    const entradasDeFormato = document.getElementById("entradasDeFormato");
    const entradasDeCampo = document.getElementById("entradasDeCampo");

    entradasDeFormato.innerHTML = '<div class="coluna-de-cabecalho">Formato</div>';
    entradasDeCampo.innerHTML = '<div class="coluna-de-cabecalho">Campo</div>';

    for (let i = 0; i < numLinhas; i++) {
        const selecaoDeFormato = document.createElement("select");
        selecaoDeFormato.className = "selecao-de-formato";
        selecaoDeFormato.name = "formato";
        selecaoDeFormato.id = `formato${i}`;

        opcoesDeFormato.forEach(opcao => {
            const elementoOpcao = document.createElement("option");
            elementoOpcao.value = opcao;
            elementoOpcao.textContent = opcao;
            selecaoDeFormato.appendChild(elementoOpcao);
        });

        entradasDeFormato.appendChild(selecaoDeFormato);

        const entradaDeCampo = document.createElement("input");
        entradaDeCampo.className = "campo-de-entrada";
        entradaDeCampo.required = true;
        entradasDeCampo.appendChild(entradaDeCampo);
    }
});

document.getElementById("botaoGerar").addEventListener("click", async () => {
    const numJsonInput = document.getElementById("numJson");
    const numLinhasInput = document.getElementById("numLinhas");

    const numJson = parseInt(numJsonInput.value, 10);
    const numLinhas = parseInt(numLinhasInput.value, 10);

    const linkDownload = document.getElementById("linkDownload");
    linkDownload.style.display = "none";
    linkDownload.textContent = "Download feito com sucesso!";

    let dadosGerados = "";

    let allFieldsFilled = true;

    if (isNaN(numJson) || numJson <= 0) {
        numJsonInput.classList.add("invalid-input");
        allFieldsFilled = false;
    } else {
        numJsonInput.classList.remove("invalid-input");
    }

    if (isNaN(numLinhas) || numLinhas <= 0) {
        numLinhasInput.classList.add("invalid-input");
        allFieldsFilled = false;
    } else {
        numLinhasInput.classList.remove("invalid-input");
    }

    const entradasDeCampo = document.querySelectorAll(".campo-de-entrada");

    entradasDeCampo.forEach(entrada => {
        if (entrada.value.trim() === "") {
            entrada.classList.add("invalid-input");
            allFieldsFilled = false;
        } else {
            entrada.classList.remove("invalid-input");
        }
    });

    if (allFieldsFilled) {
        linkDownload.style.display = "inline";
        linkDownload.textContent = "Download feito com sucesso!";

        await new Promise(resolve => setTimeout(resolve, 1000));

        linkDownload.style.display = "none";
        linkDownload.textContent = "Download feito com sucesso!";

        for (let i = 0; i < numJson; i++) {
            const jsonData = {};

            const entradasDeFormato = document.querySelectorAll("#entradasDeFormato select");
            const entradasDeCampo = document.querySelectorAll("#entradasDeCampo input");

            for (let j = 0; j < entradasDeFormato.length; j++) {
                const selecaoDeFormato = entradasDeFormato[j];
                const formatoDeEntrada = selecaoDeFormato.value;
                const nomeDoCampo = entradasDeCampo[j].value;

                const valorGerado = gerarValorAleatorio(formatoDeEntrada);
                jsonData[nomeDoCampo] = valorGerado;
            }

            dadosGerados += JSON.stringify(jsonData, null, 2) + "\n\n";
        }

        const blob = new Blob([dadosGerados], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        // Acionar o download programaticamente
        const a = document.createElement("a");
        a.href = url;
        a.download = "Requisicoes.txt";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        // Limpar
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } else {
        linkDownload.style.display = "none"; // Disable the download button
    }
});

function gerarValorAleatorio(formato) {
    if (formato === "CPF") {
        return gerarCPFAleatorio();
    } else if (formato === "string") {
        return gerarStringAleatoria();
    } else if (formato === "data_completa") {
        return gerarDataAleatoria(formato);
    } else {
        return "Valor Aleatório"; // Implementar outros formatos aqui, se necessário
    }
}

function gerarStringAleatoria() {
    const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let stringAleatoria = "";

    for (let i = 0; i < 10; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        stringAleatoria += caracteres.charAt(indiceAleatorio);
    }

    return stringAleatoria;
}

// Função para gerar um CPF aleatório
function gerarCPFAleatorio() {
    let cpf = "";

    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10);
    }

    const digitosVerificadores = calcularDigitosVerificadoresCPF(cpf);
    cpf += digitosVerificadores;

    return cpf;
}
function gerarCPFAleatorio() {
    let cpf = "";

    for (let i = 0; i < 9; i++) {
        cpf += Math.floor(Math.random() * 10);
    }

    const digitosVerificadores = calcularDigitosVerificadoresCPF(cpf);
    cpf += digitosVerificadores;

    return cpf;
}

// Função para calcular os dígitos verificadores de um CPF
function calcularDigitosVerificadoresCPF(cpfSemDV) {
    let digitosCPF = cpfSemDV.split("").map(Number);
    let soma = 0;

    // Primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
        soma += digitosCPF[i] * (10 - i);
    }
    let primeiroDigitoVerificador = soma % 11;
    primeiroDigitoVerificador = primeiroDigitoVerificador < 2 ? 0 : 11 - primeiroDigitoVerificador;

    // Adicionar o primeiro dígito verificador aos dígitos do CPF
    digitosCPF.push(primeiroDigitoVerificador);

    // Segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += digitosCPF[i] * (11 - i);
    }
    let segundoDigitoVerificador = soma % 11;
    segundoDigitoVerificador = segundoDigitoVerificador < 2 ? 0 : 11 - segundoDigitoVerificador;

    // Retornar os dígitos verificadores como string
    return `${primeiroDigitoVerificador}${segundoDigitoVerificador}`;
}

// Função para gerar uma data aleatória
function gerarDataAleatoria(formato) {
    const mesesCom31Dias = [1, 3, 5, 7, 8, 10, 12];
    const mesesCom30Dias = [4, 6, 9, 11];

    let dia, mes, ano;
    const separadores = ['/', '-', ''];

    if (formato === "01/01/2023" || formato === "30/01/2023" || formato === "01012023" || formato === "30012023") {
        dia = Math.floor(Math.random() * 31) + 1;
        mes = Math.floor(Math.random() * 12) + 1;
        ano = 2023;
    } else if (formato === "01-01-2023" || formato === "30-01-2023") {
        dia = Math.floor(Math.random() * 31) + 1;
        mes = Math.floor(Math.random() * 12) + 1;
        ano = 2023;
    } else if (formato === "30/02/2023" || formato === "30-02-2023" || formato === "02-30-2023" ||
        formato === "2023-02-30" || formato === "2023-30-02" || formato === "02/30/2023" ||
        formato === "2023/02/30" || formato === "2023/30/02") {
        dia = 30;
        mes = 2;
        ano = 2023;
    } else {
        dia = Math.floor(Math.random() * 31) + 1;
        mes = Math.floor(Math.random() * 12) + 1;
        ano = Math.floor(Math.random() * (2023 - 1900)) + 1900; // Gera anos entre 1900 e 2023
    }

    if (mesesCom31Dias.includes(mes)) {
        dia = Math.min(dia, 31);
    } else if (mesesCom30Dias.includes(mes)) {
        dia = Math.min(dia, 30);
    } else if (mes === 2) {
        const isLeapYear = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
        dia = Math.min(dia, isLeapYear ? 29 : 28);
    }

    const diaFormatado = dia.toString().padStart(2, '0');
    const mesFormatado = mes.toString().padStart(2, '0');
    const separadorAleatorio = separadores[Math.floor(Math.random() * separadores.length)];

    if (formato === "01/01/2023" || formato === "01-01-2023" || formato === "30/01/2023" || formato === "30-01-2023") {
        return `${diaFormatado}${separadorAleatorio}${mesFormatado}${separadorAleatorio}${ano}`;
    } else if (formato === "01012023" || formato === "30012023") {
        return `${diaFormatado}${mesFormatado}${ano}`;
    } else if (formato === "02-30-2023" || formato === "2023-02-30" || formato === "2023-30-02" ||
        formato === "02/30/2023" || formato === "2023/02/30" || formato === "2023/30/02") {
        return `${ano}${separadorAleatorio}${mesFormatado}${separadorAleatorio}${diaFormatado}`;
    } else {
        return `${diaFormatado}${separadorAleatorio}${mesFormatado}${separadorAleatorio}${ano}`;
    }
}