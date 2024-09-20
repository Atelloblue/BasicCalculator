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
        historyDisplay.textContent = '';
    }

    function inputDecimal() {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
        historyDisplay.textContent = '';
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

        // Update display to show the current operation
        display.textContent = `${firstOperand} ${operator}`; // Show the operation on display
        historyDisplay.textContent = '';
    }

    function performCalculation(firstOperand, secondOperand, operator) {
        // Check if operands are numbers (including checking for null or undefined)
        if (firstOperand == null || secondOperand == null || 
            typeof firstOperand !== 'number' || typeof secondOperand !== 'number') {
            alert("Operands must be numbers");
            return 'Error';
        }

        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '×':
                return firstOperand * secondOperand;
            case '÷':
                if (secondOperand === 0) {
                    alert("Can't divide by 0");
                    return 'Error';
                } else {
                    return firstOperand / secondOperand;
                }
            default:
                return null; // Return null for unsupported operators
        }
    }

    function handleEqual() {
        if (!operator || waitingForSecondOperand) {
            return;
        }

        const inputValue = parseFloat(currentInput);
        const result = performCalculation(firstOperand, inputValue, operator);
        currentInput = `${parseFloat(result.toFixed(7))}`;
        historyDisplay.textContent = `${firstOperand} ${operator} ${inputValue}`; // Show the operation
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = true;
        updateDisplay();
    }

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
                case '-':
                case '+':
                    handleOperator(keyValue);
                    break;
                default:
                    if (Number.isInteger(parseFloat(keyValue))) {
                        inputDigit(keyValue);
                        // Update display to show current operation
                        if (operator) {
                            display.textContent = `${firstOperand} ${operator} ${currentInput}`;
                        }
                    }
            }
        });
    });
});
