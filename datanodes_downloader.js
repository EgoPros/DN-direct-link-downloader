const axios = require('axios'); // Импортируем Axios для HTTP запросов
const fs = require('fs'); // Импортируем fs для работы с файловой системой
const readline = require('readline'); // Импортируем readline для ввода данных с клавиатуры

// Функция для обработки одной ссылки
async function processLink(link) {
    try {
        // Извлечение ID и имени файла из ссылки
        const urlParts = link.split('/');
        const fileId = urlParts[3];
        const fileName = urlParts[4];
        
        // Данные для первого POST запроса
        const firstPostData = {
            op: 'download1',
            usr_login: '',
            id: fileId,
            fname: fileName,
            referer: '',
            method_free: 'Free Download >>'
        };

        console.log(`Начинается обработка ссылки: ${link}`);

        // Первый POST запрос
        const firstResponse = await axios.post('https://datanodes.to/download', new URLSearchParams(firstPostData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Проверка успешности первого запроса
        if (firstResponse.status !== 200) {
            throw new Error(`Первый POST запрос завершился с ошибкой: ${firstResponse.status}`);
        }

        // Данные для второго POST запроса
        const secondPostData = {
            op: 'download2',
            id: fileId,
            rand: '',
            referer: 'https://datanodes.to/download',
            method_free: 'Free Download >>',
            method_premium: '',
            adblock_detected: ''
        };

        // Второй POST запрос
        const secondResponse = await axios.post('https://datanodes.to/download', new URLSearchParams(secondPostData), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            maxRedirects: 0, // Чтобы поймать редирект без его выполнения
            validateStatus: function (status) {
                return status === 302; // Принимаем только статус 302
            }
        });

        // Извлекаем URL перенаправления из заголовка 'Location'
        const redirectUrl = secondResponse.headers.location;

        if (!redirectUrl) {
            throw new Error('Не удалось найти URL перенаправления в ответе.');
        }

        console.log(`Обработка ссылки завершена: ${link}`);
        return redirectUrl; // Возвращаем URL перенаправления
    } catch (error) {
        console.error(`Ошибка при обработке ссылки ${link}:`, error.message);
        return null; // В случае ошибки возвращаем null
    }
}

// Основная функция для обработки массива ссылок
async function processLinks(links) {
    const results = [];

    console.log(`Начало обработки ${links.length} ссылок...`);

    // Обрабатываем каждую ссылку
    for (const link of links) {
        const result = await processLink(link);
        if (result) {
            results.push(result);
        }
    }

    // Сохраняем результаты в файл
    fs.writeFileSync('results.txt', results.join('\n'), 'utf-8');
    console.log('Ссылки перенаправления сохранены в файл results.txt');
    console.log('Обработка всех ссылок завершена.');
}

// Настройка интерфейса readline для ввода данных с клавиатуры
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Введите ссылки по одной на строке (пустая строка для завершения):\n'
});

// Массив для хранения введенных ссылок
const links = [];

// Запрос ввода от пользователя
rl.prompt();

rl.on('line', (line) => {
    if (line.trim() === '') { // Если строка пустая, заканчиваем ввод
        rl.close();
    } else {
        links.push(line.trim()); // Добавляем ссылку в массив
        rl.prompt(); // Продолжаем запрос ввода
    }
}).on('close', () => {
    if (links.length > 0) {
        processLinks(links); // Запуск обработки введенных ссылок
    } else {
        console.log('Нет введенных ссылок для обработки.');
    }
});
