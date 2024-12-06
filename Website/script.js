// script.js
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const exportBtn = document.getElementById('export-btn');
    const passwordsDiv = document.getElementById('passwords');
    const historyList = document.getElementById('history');
    const lengthInput = document.getElementById('length');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const complexitySelect = document.getElementById('complexity');
    const otpCheckbox = document.getElementById('generate-otp');

    let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];

    function updateHistory() {
        historyList.innerHTML = '';
        passwordHistory.slice(-10).reverse().forEach(pwd => {
            const li = document.createElement('li');
            li.textContent = pwd;
            historyList.appendChild(li);
        });
    }

    updateHistory();

    function generatePassword(length, options) {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let characters = '';
        if (options.uppercase) characters += upper;
        if (options.lowercase) characters += lower;
        if (options.numbers) characters += numbers;
        if (options.symbols) characters += symbols;
        if (characters === '') return '';

        let password = '';
        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }

    function assessStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        let strengthPercent = (strength / 5) * 100;
        let strengthColor = 'red';
        if (strengthPercent > 60) strengthColor = 'orange';
        if (strengthPercent > 80) strengthColor = 'green';

        return { strengthPercent, strengthColor };
    }

    function createPasswordElement(password) {
        const div = document.createElement('div');
        div.textContent = password;

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.classList.add('copy-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(password);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 2000);
        });

        const strength = assessStrength(password);
        const strengthBar = document.createElement('div');
        strengthBar.classList.add('password-strength');
        const bar = document.createElement('div');
        bar.classList.add('strength-bar');
        bar.style.width = strength.strengthPercent + '%';
        bar.style.background = strength.strengthColor;
        strengthBar.appendChild(bar);

        div.appendChild(copyBtn);
        div.appendChild(strengthBar);

        return div;
    }

    generateBtn.addEventListener('click', () => {
        const length = parseInt(lengthInput.value);
        const options = {
            uppercase: uppercaseCheckbox.checked,
            lowercase: lowercaseCheckbox.checked,
            numbers: numbersCheckbox.checked,
            symbols: symbolsCheckbox.checked
        };
        const complexity = complexitySelect.value;
        const generateOTP = otpCheckbox.checked;

        let finalLength = length;
        if (generateOTP) finalLength = 6;

        const password = generatePassword(finalLength, options);
        if (password === '') {
            alert('Please select at least one character type.');
            return;
        }

        const passwordElement = createPasswordElement(password);
        passwordsDiv.innerHTML = '';
        passwordsDiv.appendChild(passwordElement);

        passwordHistory.push(password);
        localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
        updateHistory();
    });

    exportBtn.addEventListener('click', () => {
        if (passwordHistory.length === 0) {
            alert('No passwords to export.');
            return;
        }
        const blob = new Blob([passwordHistory.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password_history.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
});
