document.addEventListener('DOMContentLoaded', function() {
    const display = document.querySelector('.display');
    const historyDisplay = document.querySelector('.history');
    let currentInput = '0';
    let operator = null;
    let firstOperand = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function clearAll() {
        currentInput = '0';
        operator = null;
        firstOperand = null;
        waitingForSecondOperand = false;
        updateDisplay();
        historyDisplay.textContent = '';
    }

    function inputDigit(digit) {
        if (currentInput === '0' || waitingForSecondOperand) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            currentInput += digit;
        }
        updateDisplay();
    }

    function inputDecimal() {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    function toggleSign() {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }

    function inputPercent() {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (firstOperand == null) {
            firstOperand = inputValue; // Set the first operand
        } else if (operator) {
            const result = performCalculation(firstOperand, inputValue, operator);
            currentInput = `${parseFloat(result.toFixed(7))}`; // Update current input with the result
            firstOperand = result; // Store result as first operand
        }

        operator = nextOperator; // Update operator
        waitingForSecondOperand = true; // Indicate we're waiting for the next number

        // Update display to show current operation
        display.textContent = `${firstOperand} ${operator}`; // Show the operation on display
    }

    function performCalculation(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                return secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    function handleEqual() {
        if (!operator || waitingForSecondOperand) {
            return;
        }

        const inputValue = parseFloat(currentInput);
        const result = performCalculation(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        historyDisplay.textContent = `${firstOperand} ${operator} ${inputValue}`; // Just show the operation
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = true;
        updateDisplay();
    }

    function memoryOperation(operation) {
        switch (operation) {
            case 'M+':
                memory += parseFloat(currentInput);
                break;
            case 'M-':
                memory -= parseFloat(currentInput);
                break;
            case 'MR':
                currentInput = memory.toString();
                updateDisplay();
                break;
            case 'MC':
                memory = 0;
                break;
        }
    }

    // Event listeners for each key
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', function() {
            const keyValue = key.textContent;

            switch (keyValue) {
                case 'AC':
                    clearAll();
                    break;
                case '+/-':
                    toggleSign();
                    break;
                case '%':
                    inputPercent();
                    break;
                case '.':
                    inputDecimal();
                    break;
                case '=':
                    handleEqual();
                    break;
                case '÷':
                case '×':
                case '−':
                case '+':
                    handleOperator(keyValue);
                    // Show both the first operand and operator in display
                    display.textContent = `${firstOperand} ${operator}`;
                    break;
                case 'M+':
                case 'M-':
                case 'MR':
                case 'MC':
                    memoryOperation(keyValue);
                    break;
                default:
                    if (Number.isInteger(parseFloat(keyValue))) {
                        inputDigit(keyValue);
                        // Update the display to show current input with the first operand and operator
                        if (operator) {
                            display.textContent = `${firstOperand} ${operator} ${currentInput}`;
                        }
                    }
            }
        });
    });
});