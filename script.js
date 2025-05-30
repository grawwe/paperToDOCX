document.addEventListener('DOMContentLoaded', function() {
    // конфигурация 
    const TEMPLATE_URL = 'https://papertodocx.netlify.app/template_course.docx';
    const VKR_TEMPLATE_URL = 'https://papertodocx.netlify.app/template_vkr.docx';
    const VKR_ZADANIE_TEMPLATE_URL = 'https://papertodocx.netlify.app/template_vkr_zadanie.docx';
    const COURSE_ZADANIE_TEMPLATE_URL = 'https://papertodocx.netlify.app/template_course_zadanie.docx';
    const AKADEM_TEMPLATE_URL = 'https://papertodocx.netlify.app/template_akadem.docx';
    const VOSSTANOVLENIE_TEMPLATE_URL = 'https://papertodocx.netlify.app/template_vosstanovlenie.docx';
    
    

    // данные для кафедр 
    const kafedraOptions = {
        'Медиатехнологий': [
            'Журналистики и медиатехнологий СМИ',
            'Графики',
            'Книгоиздания и книжной торговли',
            'Рекламы'
        ],
        'Полиграфических технологий и оборудования': [
            'Технологии полиграфического производства',
            'Информационных и управляющих систем',
            'Полиграфического оборудования и управления'
        ]
    };


    // направления и профили для кафедр
    const napravlenieProfiles = {
        // ИМТ
        'Журналистики и медиатехнологий СМИ': {
            napravlenie: ['04.03.02 Журналистика', '04.04.02 Журналистика'],
            profile: 'Журналистика'
        },
        'Графики': {
            napravlenie: ['54.03.03 Графика'],
            profile: 'Художник‑график (оформление печатной продукции)'
        },
        'Книгоиздания и книжной торговли': {
            napravlenie: ['42.03.03 Издательское дело', '42.04.03 Издательское дело'],
            profile: {
                '42.03.03 Издательское дело': 'Издательские процессы в медиасфере',
                '42.04.03 Издательское дело': 'Издательские стратегии в медиапространстве'
            }
        },
        'Рекламы': {
            napravlenie: ['42.03.01 Реклама и связи с общественностью', '42.04.01 Реклама и связи с общественностью'],
            profile: {
                '42.03.01 Реклама и связи с общественностью': ['Реклама в медиаиндустрии', 'PR в медиаиндустрии'],
                '42.04.01 Реклама и связи с общественностью': 'Реклама и связи с общественностью в медиаиндустрии'
            }
        },
        
        // ИПТИО
        'Технологии полиграфического производства': {
            napravlenie: [
                '29.03.03 Технология полиграфического и упаковочного производства',
                '29.04.03 Технология полиграфического и упаковочного производства'
            ],
            profile: {
                '29.03.03 Технология полиграфического и упаковочного производства': [
                    'Технология полиграфического производства',
                    'Технология и дизайн упаковочного производства'
                ],
                '29.04.03 Технология полиграфического и упаковочного производства': 'Технология полиграфического производства'
            }
        },
        'Информационных и управляющих систем': {
            napravlenie: [
                '09.03.01 Информатика и вычислительная техника',
                '09.03.02 Информационные системы и технологии',
                '09.04.02 Информационные системы и технологии'
            ],
            profile: {
                '09.03.01 Информатика и вычислительная техника': 'Разработка IT‑систем и мультимедийных приложений',
                '09.03.02 Информационные системы и технологии': [
                    'Информационные технологии в дизайне',
                    'Информационные технологии в медиаиндустрии'
                ],
                '09.04.02 Информационные системы и технологии': 'Цифровые технологии в медиакоммуникациях и дизайне'
            }
        },
        'Полиграфического оборудования и управления': {
            napravlenie: [
                '15.03.02 Технологические машины и оборудование',
                '38.03.02 Менеджмент'
            ],
            profile: {
                '15.03.02 Технологические машины и оборудование': 'Принтмедиасистемы и комплексы',
                '38.03.02 Менеджмент': 'Менеджмент в медиабизнесе и полиграфии'
            }
        }
    };

    // Месяцы и количество дней в них
    const months = [
        { name: 'январь', days: 31 },
        { name: 'февраль', days: 29 },
        { name: 'март', days: 31 },
        { name: 'апрель', days: 30 },
        { name: 'май', days: 31 },
        { name: 'июнь', days: 30 },
        { name: 'июль', days: 31 },
        { name: 'август', days: 31 },
        { name: 'сентябрь', days: 30 },
        { name: 'октябрь', days: 31 },
        { name: 'ноябрь', days: 30 },
        { name: 'декабрь', days: 31 }
    ];

    // инициализация 
    let templates = JSON.parse(localStorage.getItem('templates')) || [];
    let currentEditingIndex = null;


    // получение элементов 
    const createBtn = document.getElementById('createTemplateBtn');
    const listBtn = document.getElementById('myTemplatesBtn');
    const infoBtn = document.getElementById('libInfo');
    const courseTemplateBtn = document.querySelector('.templateButtons .imageBtn:first-child');
    const vkrTemplateBtn = document.querySelector('.templateButtons .imageBtn:nth-child(2)');
    const courseZadanieTemplateBtn = document.querySelector('.templateButtons .imageBtn:nth-child(3)');
    const vkrZadanieTemplateBtn = document.querySelector('.templateButtons .imageBtn:nth-child(4)');
    const createModal = document.getElementById('createTemplateModal');
    const listModal = document.getElementById('templatesListModal');
    const infoModal = document.getElementById('libModal');
    const templateFields = document.getElementById('templateFields');
    const addFieldBtn = document.getElementById('addFieldBtn');
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const templatesContainer = document.getElementById('templatesContainer');
    const akademTemplateBtn = document.querySelector('.templateButtons .imageBtn:nth-child(5)');
    const vosstanovlenieTemplateBtn = document.querySelector('.templateButtons .imageBtn:nth-child(6)');


    // инициализация приложения 
    function initApp() {
        // Обработчики
        if (createBtn) createBtn.addEventListener('click', openCreateModal);
        if (listBtn) listBtn.addEventListener('click', openListModal);
        if (addFieldBtn) addFieldBtn.addEventListener('click', addField);
        if (saveTemplateBtn) saveTemplateBtn.addEventListener('click', saveTemplate);
        if (infoBtn) {
            infoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.modal').forEach(m => m.remove()); // удаляем все существующие модальные окна
                
                // создаем новое модальное окно
                const modal = document.createElement('div');
                modal.className = 'modal active';
                modal.innerHTML = `
                    <div class="modalContent">
                        <h2>Информация о проекте</h2>
                        <p>=====================</p>
                        <p>Веб-Приложение paperToDOCX написано с использованием библиотек:</p>
                        <p><a href="https://github.com/open-xml-templating/docxtemplater?tab=readme-ov-file">docxtemplater</a> — для создания и заполнения шаблонов формата .docx</p>
                        <p><a href="https://github.com/open-xml-templating/pizzip">pizzip</a> — вспомогательная библиотека для работы docxtemplater</p>
                        <p>=====================</p>
                        <p>Также используется сервис <a href="https://www.cloudflare.com/ru-ru/">Cloudflare</a></p>
                        <p>Исключительно как CDN (Content Delivery Network) для быстрой загрузки используемых ранее упомянутых библиотек.</p>
                        <p>=====================</p>
                        <p>Все иконки взяты из открытого доступа с сайта <a href="https://www.flaticon.com">www.flaticon.com</a>. По <a href="https://support.flaticon.com/articles/en_US/Knowledge/Personal-use-FI">правилам</a> бесплатного использования, для каждого используемого значка необходимо указывать автора.</p>
                        <p>Авторы: <a href="https://www.flaticon.com/authors/pixel-perfect">Pixel perfect</a>, <a href="https://www.flaticon.com/authors/three-musketeers">Three musketeers</a>, <a href="https://www.flaticon.com/authors/freepik">Freepik</a></p>
                        <p>=====================</p>
                        <div class="modalActions">
                            <button class="modalClose">Закрыть</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';
                
                // обработчик закрытия
                modal.querySelector('.modalClose').addEventListener('click', function() {
                    modal.remove();
                    document.body.style.overflow = 'auto';
                });
            });
        }

        // обработчики для кнопок шаблонов
        if (courseTemplateBtn) {
            courseTemplateBtn.addEventListener('click', showCourseForm);
        }
        
        if (vkrTemplateBtn) {
            vkrTemplateBtn.addEventListener('click', showVkrForm);
        }

        if (courseZadanieTemplateBtn) {
            courseZadanieTemplateBtn.addEventListener('click', showCourseZadanieForm);
        }

        if (vkrZadanieTemplateBtn) {
            vkrZadanieTemplateBtn.addEventListener('click', showVkrZadanieForm);
        }

        if (akademTemplateBtn) {
            akademTemplateBtn.addEventListener('click', showAkademForm);
        }   

        if (vosstanovlenieTemplateBtn) {
            vosstanovlenieTemplateBtn.addEventListener('click', showVosstanovlenieForm);
        }

        // закрытие модальных окон 
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modalClose')) {
                closeAllModals();
            }
            if (e.target.classList.contains('modal')) {
                if (e.target === e.currentTarget.querySelector('.modal')) {
                    closeAllModals();
                }
            }
        });
    }

    // Функция показа формы академического отпуска
function showAkademForm() {
    closeAllModals();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modalContent">
            <h2>Заявление на академический отпуск</h2>
            
            <div class="formField">
                <label>ФИО студента:</label>
                <input type="text" id="fio" class="formInput" placeholder="Шадрин Е.М.">
            </div>
            
            <div class="formField">
                <label>Институт:</label>
                <select id="institute" class="formInput">
                    <option value="Медиатехнологий">Медиатехнологий</option>
                    <option value="Полиграфических технологий и оборудования">Полиграфических технологий и оборудования</option>
                </select>
            </div>
            
            <div class="formField">
                <label>Курс:</label>
                <input type="number" id="course" class="formInput" min="1" max="6" placeholder="4">
            </div>
            
            <div class="formField">
                <label>Группа:</label>
                <input type="text" id="group" class="formInput" placeholder="4-ТИД-7">
            </div>
            
            <div class="formField">
                <label>Форма обучения:</label>
                <select id="form" class="formInput">
                    <option value="очной">очной</option>
                    <option value="очно-заочной">очно-заочной</option>
                    <option value="заочной">заочной</option>
                </select>
            </div>
            
            <div class="formField">
                <label>Направление подготовки:</label>
                <input type="text" id="napravlenie" class="formInput" placeholder="09.03.01 Информатика и вычислительная техника">
            </div>
            
            <div class="formField">
                <label>Тип обучения:</label>
                <select id="obrtype" class="formInput">
                    <option value="по договору">по договору</option>
                    <option value="за счёт бюджетных ассигнований">за счёт бюджетных ассигнований</option>
                </select>
            </div>
            
            <div class="formField">
                <label>Телефон:</label>
                <input type="tel" id="phone" class="formInput" placeholder="+7(999)123-45-67" pattern="\+7\(\d{3}\)\d{3}-\d{2}-\d{2}">
            </div>
            
            <div class="formField">
                <label>Причина:</label>
                <input type="text" id="reason" class="formInput" placeholder="медицинские показания">
            </div>
            
            <div class="formField">
                <label>Дата начала:</label>
                <div class="dateSelectors">
                    <select id="startDay" class="formInput dateSelect"></select>
                    <select id="startMonth" class="formInput dateSelect"></select>
                    <select id="startYear" class="formInput dateSelect"></select>
                </div>
            </div>
            
            <div class="formField">
                <label>Дата окончания:</label>
                <div class="dateSelectors">
                    <select id="endDay" class="formInput dateSelect"></select>
                    <select id="endMonth" class="formInput dateSelect"></select>
                    <select id="endYear" class="formInput dateSelect"></select>
                </div>
            </div>
            
            <div class="formField">
                <label>Прилагаемые документы:</label>
                <input type="text" id="info" class="formInput" placeholder="медицинская справка">
            </div>
            
            <div class="modalActions">
                <button id="generateAkademDocx" class="primary-btn">Сгенерировать DOCX</button>
                <button class="modalClose secondary-btn">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Инициализация дат
    initDateSelectorsForAkadem();
    
    // Обработчики событий
    modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
    document.getElementById('startMonth').addEventListener('change', function() {
        updateDays('startDay', 'startMonth');
    });
    document.getElementById('endMonth').addEventListener('change', function() {
        updateDays('endDay', 'endMonth');
    });
    document.getElementById('generateAkademDocx').addEventListener('click', generateAkademDocx);
    
    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        const x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[1] ? '' : `+${x[1]}${x[2] ? '(' + x[2] : ''}${x[3] ? ')' + x[3] : ''}${x[4] ? '-' + x[4] : ''}${x[5] ? '-' + x[5] : ''}`;
    });
}

function initDateSelectorsForAkadem() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Инициализация месяцев
    const monthSelects = document.querySelectorAll('#startMonth, #endMonth');
    monthSelects.forEach(select => {
        select.innerHTML = months.map(month => 
            `<option value="${month.name}">${month.name}</option>`
        ).join('');
    });
    
    // Инициализация дней
    updateDays('startDay', 'startMonth');
    updateDays('endDay', 'endMonth');
    
    // Инициализация годов
    const yearSelects = document.querySelectorAll('#startYear, #endYear');
    yearSelects.forEach(select => {
        select.innerHTML = `
            <option value="${currentYear}">${currentYear}</option>
            <option value="${currentYear + 1}">${currentYear + 1}</option>
        `;
    });
}

// Генерация документа академического отпуска
async function generateAkademDocx() {
    try {
        // Извлекаем код направления из полного названия
        const napravlenie = document.getElementById('napravlenie').value;
        const code = napravlenie.match(/\d{2}\.\d{2}\.\d{2}/)?.[0] || '';
        
        // Получаем данные формы
        const formData = {
            fio: document.getElementById('fio').value,
            institute: document.getElementById('institute').value,
            course: document.getElementById('course').value,
            group: document.getElementById('group').value,
            form: document.getElementById('form').value,
            code: code,
            napravlenie: napravlenie,
            obrtype: document.getElementById('obrtype').value,
            phone: document.getElementById('phone').value,
            reason: document.getElementById('reason').value,
            info: document.getElementById('info').value,
            '1day': document.getElementById('startDay').value,
            '1month': document.getElementById('startMonth').value,
            '1year': document.getElementById('startYear').value,
            '2day': document.getElementById('endDay').value,
            '2month': document.getElementById('endMonth').value,
            '2year': document.getElementById('endYear').value,
            '3day': new Date().getDate(),
            '3month': months[new Date().getMonth()].name,
            '3year': new Date().getFullYear()
        };

        // Загрузка шаблона
        const response = await fetch(AKADEM_TEMPLATE_URL);
        const template = await response.blob();
        
        // Генерация документа
        const reader = new FileReader();
        reader.onload = function() {
            const zip = new PizZip(reader.result);
            const doc = new docxtemplater().loadZip(zip);
            doc.setData(formData);
            doc.render();
            const out = doc.getZip().generate({ type: "blob" });
            saveAs(out, `akadem_${formData.fio.split(' ')[0]}.docx`);
            closeAllModals();
        };
        reader.readAsArrayBuffer(template);
    } catch (error) {
        console.error('Ошибка генерации.', error);
        alert('Ошибка при создании документа!');
    }
}

// Функция показа формы восстановления обучения
function showVosstanovlenieForm() {
    closeAllModals();
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modalContent">
            <h2>Заявление на восстановление обучения</h2>
            
            <div class="formField">
                <label>ФИО студента:</label>
                <input type="text" id="fio" class="formInput" placeholder="Шадрин Е.М.">
            </div>
            
            <div class="formField">
                <label>Институт:</label>
                <select id="institute" class="formInput">
                    <option value="Медиатехнологий">Медиатехнологий</option>
                    <option value="Полиграфических технологий и оборудования">Полиграфических технологий и оборудования</option>
                </select>
            </div>
            
            <div class="formField">
                <label>Курс:</label>
                <input type="number" id="course" class="formInput" min="1" max="6" placeholder="4">
            </div>
            
            <div class="formField">
                <label>Группа:</label>
                <input type="text" id="group" class="formInput" placeholder="4-ТИД-7">
            </div>
            
            <div class="formField">
                <label>Форма обучения:</label>
                <select id="form" class="formInput">
                    <option value="очной">очной</option>
                    <option value="очно-заочной">очно-заочной</option>
                    <option value="заочной">заочной</option>
                </select>
            </div>
            
            <div class="formField">
                <label>Направление подготовки:</label>
                <input type="text" id="napravlenie" class="formInput" placeholder="09.03.01 Информатика и вычислительная техника">
            </div>
            
            <div class="formField">
                <label>Профиль подготовки:</label>
                <input type="text" id="profile" class="formInput" placeholder="Разработка IT-систем и мультимедийных приложений">
            </div>
            
            <div class="formField">
                <label>Тип обучения:</label>
                <select id="obrtype" class="formInput">
                    <option value="по договору">по договору</option>
                    <option value="за счёт бюджетных ассигнований">за счёт бюджетных ассигнований</option>
                </select>
            </div>
            
            <div class="formField">
                <label>Телефон:</label>
                <input type="tel" id="phone" class="formInput" placeholder="+7(999)123-45-67" pattern="\+7\(\d{3}\)\d{3}-\d{2}-\d{2}">
            </div>
            
            <div class="formField">
                <label>Дата восстановления:</label>
                <div class="dateSelectors">
                    <select id="restoreDay" class="formInput dateSelect"></select>
                    <select id="restoreMonth" class="formInput dateSelect"></select>
                    <select id="restoreYear" class="formInput dateSelect"></select>
                </div>
            </div>
            
            <div class="modalActions">
                <button id="generateVosstanovlenieDocx" class="primary-btn">Сгенерировать DOCX</button>
                <button class="modalClose secondary-btn">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Инициализация дат
    initDateSelectorsForVosstanovlenie();
    
    // Обработчики событий
    modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
    document.getElementById('restoreMonth').addEventListener('change', function() {
        updateDays('restoreDay', 'restoreMonth');
    });
    document.getElementById('generateVosstanovlenieDocx').addEventListener('click', generateVosstanovlenieDocx);
    
    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        const x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[1] ? '' : `+${x[1]}${x[2] ? '(' + x[2] : ''}${x[3] ? ')' + x[3] : ''}${x[4] ? '-' + x[4] : ''}${x[5] ? '-' + x[5] : ''}`;
    });
}

function initDateSelectorsForVosstanovlenie() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Инициализация месяцев
    const monthSelect = document.getElementById('restoreMonth');
    monthSelect.innerHTML = months.map(month => 
        `<option value="${month.name}">${month.name}</option>`
    ).join('');
    
    // Инициализация дней
    updateDays('restoreDay', 'restoreMonth');
    
    // Инициализация годов
    const yearSelect = document.getElementById('restoreYear');
    yearSelect.innerHTML = `
        <option value="${currentYear}">${currentYear}</option>
        <option value="${currentYear + 1}">${currentYear + 1}</option>
    `;
}

// Генерация документа восстановления обучения
async function generateVosstanovlenieDocx() {
    try {
        // Извлекаем код направления из полного названия
        const napravlenie = document.getElementById('napravlenie').value;
        const code = napravlenie.match(/\d{2}\.\d{2}\.\d{2}/)?.[0] || '';
        
        // Получаем данные формы
        const formData = {
            fio: document.getElementById('fio').value,
            institute: document.getElementById('institute').value,
            course: document.getElementById('course').value,
            group: document.getElementById('group').value,
            form: document.getElementById('form').value,
            code: code,
            napravlenie: napravlenie,
            profile: document.getElementById('profile').value,
            obrtype: document.getElementById('obrtype').value,
            phone: document.getElementById('phone').value,
            '1day': document.getElementById('restoreDay').value,
            '1month': document.getElementById('restoreMonth').value,
            '1year': document.getElementById('restoreYear').value,
            '2day': new Date().getDate(),
            '2month': months[new Date().getMonth()].name,
            '2year': new Date().getFullYear()
        };

        // Загрузка шаблона
        const response = await fetch(VOSSTANOVLENIE_TEMPLATE_URL);
        const template = await response.blob();
        
        // Генерация документа
        const reader = new FileReader();
        reader.onload = function() {
            const zip = new PizZip(reader.result);
            const doc = new docxtemplater().loadZip(zip);
            doc.setData(formData);
            doc.render();
            const out = doc.getZip().generate({ type: "blob" });
            saveAs(out, `vosstanovlenie_${formData.fio.split(' ')[0]}.docx`);
            closeAllModals();
        };
        reader.readAsArrayBuffer(template);
    } catch (error) {
        console.error('Ошибка генерации.', error);
        alert('Ошибка при создании документа!');
    }
    }
    // Функция показа формы задания курсовой
    function showCourseZadanieForm() {
        closeAllModals();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modalContent">
                <h2>Бланк задания для курсовой работы</h2>
                
                <div class="formField">
                    <label>Дисциплина:</label>
                    <input type="text" id="discipline" class="formInput">
                </div>
                
                <div class="formField">
                    <label>ФИО студента:</label>
                    <input type="text" id="name" class="formInput" placeholder="Шадрин Е.М.">
                </div>
                
                <div class="formField">
                    <label>Группа:</label>
                    <input type="text" id="group" class="formInput" placeholder="4-ТИД-7">
                </div>
                
                <div class="formField">
                    <label>Тема работы:</label>
                    <input type="text" id="tema" class="formInput">
                </div>
                
                <div class="formField">
                    <label>Срок сдачи студентом законченного проекта:</label>
                    <div class="dateSelectors">
                        <select id="sday" class="formInput dateSelect"></select>
                        <select id="smonth" class="formInput dateSelect"></select>
                        <select id="syear" class="formInput dateSelect"></select>
                    </div>
                </div>
                
                <div class="formField">
                    <label>Исходные данные к проекту:</label>
                    <textarea id="ish_dan" class="formInput" rows="3"></textarea>
                </div>
                
                <div class="formField">
                    <label>Содержание расчетно-пояснительной записки:</label>
                    <textarea id="zapiska" class="formInput" rows="3"></textarea>
                </div>
                
                <div class="formField">
                    <label>Перечень графического материала:</label>
                    <textarea id="gr_mat" class="formInput" rows="3"></textarea>
                </div>
                
                <div class="formField">
                    <label>Литература и прочие материалы, рекомендуемые для изучения:</label>
                    <textarea id="liter" class="formInput" rows="3"></textarea>
                </div>
                
                <div class="formField">
                    <label>ФИО руководителя:</label>
                    <input type="text" id="prep" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
                
                <div class="formField">
                    <label>Дата выдачи задания:</label>
                    <div class="dateSelectors">
                        <select id="vday" class="formInput dateSelect"></select>
                        <select id="vmonth" class="formInput dateSelect"></select>
                        <select id="vyear" class="formInput dateSelect"></select>
                    </div>
                </div>
                
                <div class="modalActions">
                    <button id="generateCourseZadanieDocx" class="primary-btn">Сгенерировать DOCX</button>
                    <button class="modalClose secondary-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Инициализация дат
        initDateSelectors();
        
        // Обработчики событий
        modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
        document.getElementById('smonth').addEventListener('change', function() {
            updateDays('sday', 'smonth');
        });
        document.getElementById('vmonth').addEventListener('change', function() {
            updateDays('vday', 'vmonth');
        });
        document.getElementById('generateCourseZadanieDocx').addEventListener('click', generateCourseZadanieDocx);
    }

    // Инициализация выбора даты
    function initDateSelectors() {
        // Текущая дата
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        
        // Инициализация месяцев
        const monthSelects = document.querySelectorAll('#smonth, #vmonth');
        monthSelects.forEach(select => {
            select.innerHTML = months.map(month => 
                `<option value="${month.name}">${month.name}</option>`
            ).join('');
        });
        
        // Инициализация дней
        updateDays('sday', 'smonth');
        updateDays('vday', 'vmonth');
        
        // Инициализация годов
        const yearSelects = document.querySelectorAll('#syear, #vyear');
        yearSelects.forEach(select => {
            select.innerHTML = `
                <option value="${currentYear - 1}">${currentYear - 1}</option>
                <option value="${currentYear}">${currentYear}</option>
                <option value="${currentYear + 1}">${currentYear + 1}</option>
            `;
        });
    }

    // Обновление списка дней при изменении месяца
    function updateDays(dayId, monthId) {
        const monthSelect = document.getElementById(monthId);
        const daySelect = document.getElementById(dayId);
        
        if (!monthSelect || !daySelect) return;
        
        const selectedMonth = months.find(m => m.name === monthSelect.value);
        if (!selectedMonth) return;
        
        const currentDay = parseInt(daySelect.value) || 1;
        daySelect.innerHTML = '';
        
        for (let i = 1; i <= selectedMonth.days; i++) {
            daySelect.innerHTML += `<option value="${i}" ${i === currentDay ? 'selected' : ''}>${i}</option>`;
        }
    }

    // Генерация документа задания курсовой
    async function generateCourseZadanieDocx() {
        try {
            // получаем данные формы 
            const formData = {
                discipline: document.getElementById('discipline').value,
                name: document.getElementById('name').value,
                group: document.getElementById('group').value,
                tema: document.getElementById('tema').value,
                sday: document.getElementById('sday').value,
                smonth: document.getElementById('smonth').value,
                syear: document.getElementById('syear').value,
                ish_dan: document.getElementById('ish_dan').value,
                zapiska: document.getElementById('zapiska').value,
                gr_mat: document.getElementById('gr_mat').value,
                liter: document.getElementById('liter').value,
                prep: document.getElementById('prep').value,
                vday: document.getElementById('vday').value,
                vmonth: document.getElementById('vmonth').value,
                vyear: document.getElementById('vyear').value
            };

            // загрузка шаблона
            const response = await fetch(COURSE_ZADANIE_TEMPLATE_URL);
            const template = await response.blob();
            
            // генерация документа 
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, `course_zadanie_${formData.name.split(' ')[0]}.docx`);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации.', error);
            alert('Ошибка при создании документа!');
        }
    }

    // функция показа формы задания ВКР
    function showVkrZadanieForm() {
        closeAllModals();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modalContent">
                <h2>Бланк задания для ВКР</h2>
                
                <div class="formField">
                    <label>ФИО студента:</label>
                    <input type="text" id="name" class="formInput" placeholder="Шадрин Е.М.">
                </div>
                
                <div class="formField">
                    <label>Направление подготовки:</label>
                    <select id="napravlenie" class="formInput">
                        <option value="09.03.01 Информатика и вычислительная техника">09.03.01 Информатика и вычислительная техника</option>
                        <option value="09.03.02 Информационные системы и технологии">09.03.02 Информационные системы и технологии</option>
                        <option value="09.04.02 Информационные системы и технологии">09.04.02 Информационные системы и технологии</option>
                    </select>
                </div>
                
                <div class="formField">
                    <label>Профиль подготовки:</label>
                    <select id="profile" class="formInput"></select>
                </div>
                
                <div class="formField">
                    <label>Тема работы:</label>
                    <input type="text" id="tema" class="formInput">
                </div>
                
                <div class="formField">
                    <label>Исходные данные по выпускной квалификационной работе:</label>
                    <textarea id="per_dan" class="formInput" rows="3"></textarea>
                </div>
                
                <div class="formField">
                    <label>Перечень подлежащих разработке в выпускной квалификационной работе вопросов или ее краткое содержание:</label>
                    <textarea id="per_soder" class="formInput" rows="3"></textarea>
                </div>
                
                <div class="formField">
                    <label>Перечень иллюстративно-графического и раздаточного материала (с точным указанием обязательных чертежей, схем, слайдов и пр.):</label>
                    <textarea id="per_illust" class="formInput" rows="3"></textarea>
                </div>
                
                <div class="formField">
                    <label>Консультанты по разделам ВКР:</label>
                    <textarea id="consult" class="formInput" rows="3" placeholder="должность, Ф.И.О, название раздела"></textarea>
                </div>
                
                <div class="formField">
                    <label>ФИО руководителя:</label>
                    <input type="text" id="prep" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
                
                <div class="modalActions">
                    <button id="generateVkrZadanieDocx" class="primary-btn">Сгенерировать DOCX</button>
                    <button class="modalClose secondary-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Инициализация профилей
        updateProfileOptionsForVkrZadanie();
        
        // Обработчики событий
        modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
        document.getElementById('napravlenie').addEventListener('change', updateProfileOptionsForVkrZadanie);
        document.getElementById('generateVkrZadanieDocx').addEventListener('click', generateVkrZadanieDocx);
    }

    // Обновление профилей для формы задания ВКР
    function updateProfileOptionsForVkrZadanie() {
        const napravlenieSelect = document.getElementById('napravlenie');
        const profileSelect = document.getElementById('profile');
        
        if (!napravlenieSelect || !profileSelect) return;
        
        const napravlenie = napravlenieSelect.value;
        const kafedra = 'Информационных и управляющих систем';
        
        if (napravlenieProfiles[kafedra]) {
            const profileData = napravlenieProfiles[kafedra].profile;
            
            if (typeof profileData === 'object') {
                const profile = profileData[napravlenie];
                if (Array.isArray(profile)) {
                    // Несколько вариантов профиля
                    profileSelect.innerHTML = profile
                        .map(opt => `<option value="${opt}">${opt}</option>`)
                        .join('');
                } else if (profile) {
                    // Один профиль
                    profileSelect.innerHTML = `<option value="${profile}">${profile}</option>`;
                }
            }
        }
    }

    // Генерация документа задания ВКР
    async function generateVkrZadanieDocx() {
        try {
            // получаем данные формы 
            const formData = {
                name: document.getElementById('name').value,
                napravlenie: document.getElementById('napravlenie').value,
                profile: document.getElementById('profile').value,
                tema: document.getElementById('tema').value,
                per_dan: document.getElementById('per_dan').value,
                per_soder: document.getElementById('per_soder').value,
                per_illust: document.getElementById('per_illust').value,
                consult: document.getElementById('consult').value,
                prep: document.getElementById('prep').value
            };

            // загрузка шаблона
            const response = await fetch(VKR_ZADANIE_TEMPLATE_URL);
            const template = await response.blob();
            
            // генерация документа 
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, `vkr_zadanie_${formData.name.split(' ')[0]}.docx`);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации.', error);
            alert('Ошибка при создании документа!');
        }
    }

    // функция показа формы ВКР
    function showVkrForm() {
        closeAllModals();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modalContent">
                <h2>Титульный лист ВКР</h2>
                
                <div class="formField">
                    <label>Институт:</label>
                    <select id="instituteSelect" class="formInput">
                        <option value="Медиатехнологий">Медиатехнологий</option>
                        <option value="Полиграфических технологий и оборудования">Полиграфических технологий и оборудования</option>
                    </select>
                </div>
                
                <div class="formField">
                    <label>Кафедра:</label>
                    <select id="kafedraSelect" class="formInput"></select>
                </div>
                
                <div class="formField">
                    <label>Направление подготовки:</label>
                    <select id="napravlenie" class="formInput"></select>
                </div>
                
                <div class="formField">
                    <label>Тема работы:</label>
                    <input type="text" id="tema" class="formInput">
                </div>
                
                <div class="formField">
                    <label>ФИО студента:</label>
                    <input type="text" id="fio" class="formInput" placeholder="Шадрин Е.М.">
                </div>
                
                <div class="formField">
                    <label>Группа:</label>
                    <input type="text" id="group" class="formInput" placeholder="4-ТИД-7">
                </div>
                
                <div class="formField">
                    <label>ФИО руководителя:</label>
                    <input type="text" id="prep" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
                
                <div class="formField">
                    <label>Количество консультантов:</label>
                    <select id="consultantCount" class="formInput">
                        <option value="0">Нет консультантов</option>
                        <option value="1">1 консультант</option>
                        <option value="2">2 консультанта</option>
                    </select>
                </div>
                
                <div id="consultantFields"></div>
                
                <div class="formField">
                    <label>Нормоконтролёр:</label>
                    <input type="text" id="normocontrol" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
                
                <div class="formField">
                    <label>Год:</label>
                    <input type="text" id="year" class="formInput" placeholder="2025">
                </div>
                
                <div class="modalActions">
                    <button id="generateVkrDocx" class="primary-btn">Сгенерировать DOCX</button>
                    <button class="modalClose secondary-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        updateKafedraOptions();
        
        // Обработчики событий
        modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
        document.getElementById('instituteSelect').addEventListener('change', updateKafedraOptions);
        document.getElementById('kafedraSelect').addEventListener('change', updateNapravlenieOptions);
        document.getElementById('consultantCount').addEventListener('change', updateConsultantFields);
        document.getElementById('generateVkrDocx').addEventListener('click', generateVkrDocx);
        
        // Инициализация полей консультантов
        updateConsultantFields();
    }

    // Обновление полей консультантов
    function updateConsultantFields() {
        const count = document.getElementById('consultantCount').value;
        const container = document.getElementById('consultantFields');
        container.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const fieldHTML = `
                <div class="formField">
                    <label>Консультант ${i}:</label>
                    <input type="text" id="konsult${i}" class="formInput" placeholder="уч. степень, звание, Иванов И.И.">
                </div>
            `;
            container.insertAdjacentHTML('beforeend', fieldHTML);
        }
    }

    // Генерация документа ВКР
    async function generateVkrDocx() {
        try {
            // получаем данные формы 
            const napravlenie = document.getElementById('napravlenie').value;
            const napravlenieCode = napravlenie.split(' ')[0];
            const isMagistratura = napravlenieCode.split('.')[1] === '04';
            
            const formData = {
                institute: document.getElementById('instituteSelect').value,
                kafedra: document.getElementById('kafedraSelect').value,
                napravlenie: napravlenie,
                obr: isMagistratura ? 'Магистерская диссертация' : 'Бакалаврская работа',
                tema: document.getElementById('tema').value,
                FIO: document.getElementById('fio').value,
                group: document.getElementById('group').value,
                prep: document.getElementById('prep').value,
                normocontrol: document.getElementById('normocontrol').value,
                year: document.getElementById('year').value
            };
            
            // Добавляем консультантов
            const consultantCount = document.getElementById('consultantCount').value;
            for (let i = 1; i <= consultantCount; i++) {
                formData[`konsult${i}`] = document.getElementById(`konsult${i}`).value;
            }
            
            // Если консультантов меньше 2, добавляем пустые значения
            if (consultantCount < 2) formData.konsult2 = '';
            if (consultantCount < 1) formData.konsult1 = '';

            // загрузка шаблона с netlify
            const response = await fetch(VKR_TEMPLATE_URL);
            const template = await response.blob();
            
            // генерация документа 
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, `vkr_${formData.year}_${formData.FIO.split(' ')[0]}.docx`);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации.', error);
            alert('Ошибка при создании документа!');
        }
    }

    // функция показа формы курсача
    function showCourseForm() {
        closeAllModals();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modalContent">
                <h2>Титульный лист курсовой работы</h2>
                
                <div class="formField">
                    <label>Институт:</label>
                    <select id="instituteSelect" class="formInput">
                        <option value="Медиатехнологий">Медиатехнологий</option>
                        <option value="Полиграфических технологий и оборудования">Полиграфических технологий и оборудования</option>
                    </select>
                </div>
                
                <div class="formField">
                    <label>Кафедра:</label>
                    <select id="kafedraSelect" class="formInput"></select>
                </div>
                
                <div class="formField">
                    <label>Направление подготовки:</label>
                    <select id="napravlenie" class="formInput"></select>
                </div>
                
                <div class="formField" id="profileField">
                    <label>Профиль подготовки:</label>
                    <select id="profile" class="formInput"></select>
                </div>
                
                <div class="formField">
                    <label>Дисциплина:</label>
                    <input type="text" id="disciplne" class="formInput">
                </div>
                
                <div class="formField">
                    <label>Тема работы:</label>
                    <input type="text" id="tema" class="formInput">
                </div>
                
                <div class="formField">
                    <label>ФИО студента:</label>
                    <input type="text" id="fio" class="formInput" placeholder="Шадрин Е.М.">
                </div>
                
                <div class="formField">
                    <label>Группа:</label>
                    <input type="text" id="group" class="formInput" placeholder="4-ТИД-7">
                </div>
                
                <div class="formField">
                    <label>ФИО руководителя:</label>
                    <input type="text" id="prep" class="formInput" placeholder="Иванов И.И.">
                </div>
                
                <div class="formField">
                    <label>Должность руководителя:</label>
                    <input type="text" id="ryk" class="formInput" placeholder="уч. степень, звание">
                </div>
                
                <div class="formField">
                    <label>Год:</label>
                    <input type="text" id="year" class="formInput" placeholder="2025">
                </div>
                
                <div class="modalActions">
                    <button id="generateCourseDocx" class="primary-btn">Сгенерировать DOCX</button>
                    <button class="modalClose secondary-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        updateKafedraOptions();
        modal.querySelector('.modalClose').addEventListener('click', closeAllModals);
        document.getElementById('instituteSelect').addEventListener('change', updateKafedraOptions);
        document.getElementById('kafedraSelect').addEventListener('change', updateNapravlenieOptions);
        document.getElementById('napravlenie').addEventListener('change', updateProfileOptions);
        document.getElementById('generateCourseDocx').addEventListener('click', generateCourseDocx);
    }

    // обновление 
    function updateKafedraOptions() {
        const instituteSelect = document.getElementById('instituteSelect');
        if (!instituteSelect) return;
        
        const institute = instituteSelect.value;
        const kafedraSelect = document.getElementById('kafedraSelect');
        
        if (kafedraSelect) {
            kafedraSelect.innerHTML = kafedraOptions[institute]
                .map(opt => `<option value="${opt}">${opt}</option>`)
                .join('');
            
            // обновляем направления после изменения кафедры
            updateNapravlenieOptions();
        }
    }

    // обновление направлений
    function updateNapravlenieOptions() {
        const kafedraSelect = document.getElementById('kafedraSelect');
        if (!kafedraSelect) return;
        
        const kafedra = kafedraSelect.value;
        const napravlenieSelect = document.getElementById('napravlenie');
        
        if (napravlenieSelect && napravlenieProfiles[kafedra]) {
            const options = napravlenieProfiles[kafedra].napravlenie;
            napravlenieSelect.innerHTML = options
                .map(opt => `<option value="${opt}">${opt}</option>`)
                .join('');
            
            // обновляем профили после изменения направления
            if (document.getElementById('profile')) {
                updateProfileOptions();
            }
        }
    }

    // обновление профилей
    function updateProfileOptions() {
        const kafedraSelect = document.getElementById('kafedraSelect');
        const napravlenieSelect = document.getElementById('napravlenie');
        const profileSelect = document.getElementById('profile');
        
        if (!kafedraSelect || !napravlenieSelect || !profileSelect) return;
        
        const kafedra = kafedraSelect.value;
        const napravlenie = napravlenieSelect.value;
        
        if (napravlenieProfiles[kafedra]) {
            const profileData = napravlenieProfiles[kafedra].profile;
            
            if (typeof profileData === 'string') {  // один профиль  
                profileSelect.innerHTML = `<option value="${profileData}">${profileData}</option>`;
            } else if (typeof profileData === 'object') { // профиль зависит от направления
                const profile = profileData[napravlenie];
                if (Array.isArray(profile)) { // несколько вариантов профиля
                    profileSelect.innerHTML = profile
                        .map(opt => `<option value="${opt}">${opt}</option>`)
                        .join('');
                } else { // один профиль
                    profileSelect.innerHTML = `<option value="${profile}">${profile}</option>`;
                }
            }
        }
    }

    // генерация документа 
    async function generateCourseDocx() {
        try {
            // получаем данные формы 
            const formData = {
                institute: document.getElementById('instituteSelect').value,
                kafedra: document.getElementById('kafedraSelect').value,
                napravlenie: document.getElementById('napravlenie').value,
                profile: document.getElementById('profile').value,
                disciplne: document.getElementById('disciplne').value,
                tema: document.getElementById('tema').value,
                fio: document.getElementById('fio').value,
                group: document.getElementById('group').value,
                prep: document.getElementById('prep').value,
                ryk: document.getElementById('ryk').value,
                year: document.getElementById('year').value
            };

            // загрузка шаблона с netlify
            const response = await fetch(TEMPLATE_URL);
            const template = await response.blob();
            
            // генерация документа 
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, `course_work_${formData.year}_${formData.fio.split(' ')[0]}.docx`);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации.', error);
            alert('Ошибка при создании документа!');
        }
    }

    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
            modal.remove();
        });
        document.body.style.overflow = 'auto';
    }

    function openCreateModal() {
        closeAllModals();
        createModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openListModal() {
        closeAllModals();
        listModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderTemplatesList();
    }

    function openInfoModal() {
        closeAllModals();
        infoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        infoModal.querySelector('.modalClose').addEventListener('click', closeAllModals);
    }

    function addField() {
        const fieldId = Date.now();
        const fieldHTML = `
            <div class="templateField" data-id="${fieldId}">
                <input type="text" class="fieldName" placeholder="Название поля">
                <select class="fieldType">
                    <option value="text">Текст</option>
                    <option value="number">Число</option>
                    <option value="date">Дата</option>
                </select>
                <button class="removeFieldBtn" onclick="this.parentElement.remove()">×</button>
            </div>
        `;
        templateFields.insertAdjacentHTML('beforeend', fieldHTML);
    }

    function saveTemplate() {
        const templateName = document.getElementById('templateName').value;
        if (!templateName) {
            alert('Введите название шаблона!');
            return;
        }

        const fields = [];
        document.querySelectorAll('.templateField').forEach(field => {
            const name = field.querySelector('.fieldName').value;
            const type = field.querySelector('.fieldType').value;
            if (name) fields.push({ name, type });
        });

        if (fields.length === 0) {
            alert('Добавьте хотя бы одно поле!');
            return;
        }

        const template = {
            name: templateName,
            fields: fields
        };

        if (currentEditingIndex !== null) {
            templates[currentEditingIndex] = template;
            currentEditingIndex = null;
        } else {
            templates.push(template);
        }

        localStorage.setItem('templates', JSON.stringify(templates));
        closeAllModals();
    }

    function renderTemplatesList() {
        templatesContainer.innerHTML = '';
        if (templates.length === 0) {
            templatesContainer.innerHTML = '<p>У вас пока нет шаблонов</p>';
            return;
        }

        templates.forEach((template, index) => {
            const templateHTML = `
                <div class="templateItem">
                    <h3>${template.name}</h3>
                    <p>Поля: ${template.fields.map(f => f.name).join(', ')}</p>
                    <div class="templateActions">
                        <button onclick="editTemplate(${index})">Редактировать</button>
                        <button onclick="deleteTemplate(${index})">Удалить</button>
                        <button onclick="generateCustomDocx(${index})">Создать документ</button>
                    </div>
                </div>
            `;
            templatesContainer.insertAdjacentHTML('beforeend', templateHTML);
        });
    }

    window.editTemplate = function(index) {
        currentEditingIndex = index;
        const template = templates[index];
        document.getElementById('templateName').value = template.name;
        templateFields.innerHTML = '';
        
        template.fields.forEach(field => {
            const fieldId = Date.now();
            const fieldHTML = `
                <div class="templateField" data-id="${fieldId}">
                    <input type="text" class="fieldName" placeholder="Название поля" value="${field.name}">
                    <select class="fieldType">
                        <option value="text" ${field.type === 'text' ? 'selected' : ''}>Текст</option>
                        <option value="number" ${field.type === 'number' ? 'selected' : ''}>Число</option>
                        <option value="date" ${field.type === 'date' ? 'selected' : ''}>Дата</option>
                    </select>
                    <button class="removeFieldBtn" onclick="this.parentElement.remove()">×</button>
                </div>
            `;
            templateFields.insertAdjacentHTML('beforeend', fieldHTML);
        });
        
        openCreateModal();
    };

    window.deleteTemplate = function(index) {
        if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
            templates.splice(index, 1);
            localStorage.setItem('templates', JSON.stringify(templates));
            renderTemplatesList();
        }
    };

    window.generateCustomDocx = async function(index) {
        // реализация генерации документа для пользовательских шаблонов
        alert('Функция генерации документа для пользовательских шаблонов будет реализована позже');
    };

    // инициализация приложения
    initApp();
});