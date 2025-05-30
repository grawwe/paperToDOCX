document.addEventListener('DOMContentLoaded', function() {
    // Конфигурация
    const TEMPLATES = {
        COURSE: 'https://papertodocx.netlify.app/template_course.docx',
        VKR: 'https://papertodocx.netlify.app/template_vkr.docx',
        VKR_ZADANIE: 'https://papertodocx.netlify.app/template_vkr_zadanie.docx',
        COURSE_ZADANIE: 'https://papertodocx.netlify.app/template_course_zadanie.docx',
        AKADEM: 'https://papertodocx.netlify.app/template_akadem.docx',
        VOSSTANOVLENIE: 'https://papertodocx.netlify.app/template_vosstanovlenie.docx'
    };

    // Данные для кафедр и направлений
    const DATA = {
        kafedraOptions: {
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
        },
        napravlenieProfiles: {
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
        },
        months: [
            { name: 'январь', days: 31 }, { name: 'февраль', days: 29 }, { name: 'март', days: 31 },
            { name: 'апрель', days: 30 }, { name: 'май', days: 31 }, { name: 'июнь', days: 30 },
            { name: 'июль', days: 31 }, { name: 'август', days: 31 }, { name: 'сентябрь', days: 30 },
            { name: 'октябрь', days: 31 }, { name: 'ноябрь', days: 30 }, { name: 'декабрь', days: 31 }
        ]
    };

    // Состояние приложения
    const state = {
        templates: JSON.parse(localStorage.getItem('templates')) || [],
        currentEditingIndex: null
    };

    // Инициализация приложения
    function initApp() {
        // Получение элементов
        const elements = {
            createBtn: document.getElementById('createTemplateBtn'),
            listBtn: document.getElementById('myTemplatesBtn'),
            infoBtn: document.getElementById('libInfo'),
            templateButtons: document.querySelectorAll('.templateButtons .imageBtn'),
            createModal: document.getElementById('createTemplateModal'),
            listModal: document.getElementById('templatesListModal'),
            infoModal: document.getElementById('libModal'),
            templateFields: document.getElementById('templateFields'),
            addFieldBtn: document.getElementById('addFieldBtn'),
            saveTemplateBtn: document.getElementById('saveTemplateBtn'),
            templatesContainer: document.getElementById('templatesContainer')
        };

        // Назначение обработчиков
        if (elements.createBtn) elements.createBtn.addEventListener('click', openCreateModal);
        if (elements.listBtn) elements.listBtn.addEventListener('click', openListModal);
        if (elements.addFieldBtn) elements.addFieldBtn.addEventListener('click', addField);
        if (elements.saveTemplateBtn) elements.saveTemplateBtn.addEventListener('click', saveTemplate);
        if (elements.infoBtn) elements.infoBtn.addEventListener('click', showInfoModal);

        // Обработчики для кнопок шаблонов
        elements.templateButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                switch(index) {
                    case 0: showCourseForm(); break;
                    case 1: showVkrForm(); break;
                    case 2: showCourseZadanieForm(); break;
                    case 3: showVkrZadanieForm(); break;
                    case 4: showAkademForm(); break;
                    case 5: showVosstanovlenieForm(); break;
                }
            });
        });

        // Закрытие модальных окон
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modalClose')) closeAllModals();
            if (e.target.classList.contains('modal') && e.target === e.currentTarget.querySelector('.modal')) closeAllModals();
        });
    }

    // Общие функции
    function closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
            modal.remove();
        });
        document.body.style.overflow = 'auto';
    }

    function createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modalContent">
                ${content}
                <div class="modalActions">
                    <button class="modalClose secondary-btn">Отмена</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        return modal;
    }

    function initDateSelectors(dayIds = [], monthIds = [], yearIds = []) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Инициализация месяцев
        monthIds.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = DATA.months.map(m => `<option value="${m.name}">${m.name}</option>`).join('');
            }
        });

        // Инициализация дней
        dayIds.forEach((dayId, i) => {
            updateDays(dayId, monthIds[i]);
        });

        // Инициализация годов
        yearIds.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                select.innerHTML = `
                    <option value="${currentYear - 1}">${currentYear - 1}</option>
                    <option value="${currentYear}">${currentYear}</option>
                    <option value="${currentYear + 1}">${currentYear + 1}</option>
                `;
            }
        });
    }

    function updateDays(dayId, monthId) {
        const monthSelect = document.getElementById(monthId);
        const daySelect = document.getElementById(dayId);
        if (!monthSelect || !daySelect) return;

        const month = DATA.months.find(m => m.name === monthSelect.value);
        if (!month) return;

        const currentDay = parseInt(daySelect.value) || 1;
        daySelect.innerHTML = Array.from({length: month.days}, (_, i) => 
            `<option value="${i+1}" ${i+1 === currentDay ? 'selected' : ''}>${i+1}</option>`
        ).join('');
    }

    function updateKafedraOptions() {
        const instituteSelect = document.getElementById('instituteSelect');
        const kafedraSelect = document.getElementById('kafedraSelect');
        if (!instituteSelect || !kafedraSelect) return;

        kafedraSelect.innerHTML = DATA.kafedraOptions[instituteSelect.value]
            .map(opt => `<option value="${opt}">${opt}</option>`).join('');
        updateNapravlenieOptions();
    }

    function updateNapravlenieOptions() {
        const kafedraSelect = document.getElementById('kafedraSelect');
        const napravlenieSelect = document.getElementById('napravlenie');
        if (!kafedraSelect || !napravlenieSelect) return;

        const kafedra = kafedraSelect.value;
        if (DATA.napravlenieProfiles[kafedra]) {
            napravlenieSelect.innerHTML = DATA.napravlenieProfiles[kafedra].napravlenie
                .map(opt => `<option value="${opt}">${opt}</option>`).join('');
            updateProfileOptions();
        }
    }

    function updateProfileOptions() {
        const kafedraSelect = document.getElementById('kafedraSelect');
        const napravlenieSelect = document.getElementById('napravlenie');
        const profileSelect = document.getElementById('profile');
        if (!kafedraSelect || !napravlenieSelect || !profileSelect) return;

        const kafedra = kafedraSelect.value;
        const napravlenie = napravlenieSelect.value;
        const profileData = DATA.napravlenieProfiles[kafedra]?.profile;

        if (typeof profileData === 'string') {
            profileSelect.innerHTML = `<option value="${profileData}">${profileData}</option>`;
        } else if (typeof profileData === 'object') {
            const profile = profileData[napravlenie];
            if (Array.isArray(profile)) {
                profileSelect.innerHTML = profile.map(p => `<option value="${p}">${p}</option>`).join('');
            } else if (profile) {
                profileSelect.innerHTML = `<option value="${profile}">${profile}</option>`;
            }
        }
    }

    async function generateDocx(templateUrl, formData, fileName) {
        try {
            const response = await fetch(templateUrl);
            const template = await response.blob();
            
            const reader = new FileReader();
            reader.onload = function() {
                const zip = new PizZip(reader.result);
                const doc = new docxtemplater().loadZip(zip);
                doc.setData(formData);
                doc.render();
                const out = doc.getZip().generate({ type: "blob" });
                saveAs(out, fileName);
                closeAllModals();
            };
            reader.readAsArrayBuffer(template);
        } catch (error) {
            console.error('Ошибка генерации:', error);
            alert('Ошибка при создании документа!');
        }
    }

    // Функции для модальных окон
    function showInfoModal(e) {
        e.preventDefault();
        const modal = createModal(`
            <h2>Информация о проекте</h2>
            <p>=====================</p>
            <p>Веб-Приложение paperToDOCX написано с использованием библиотек:</p>
            <p><a href="https://github.com/open-xml-templating/docxtemplater?tab=readme-ov-file">docxtemplater</a> — для создания и заполнения шаблонов формата .docx</p>
            <p><a href="https://github.com/open-xml-templating/pizzip">pizzip</a> — вспомогательная библиотека для работы docxtemplater</p>
            <p>=====================</p>
            <p>Также используется сервис <a href="https://www.cloudflare.com/ru-ru/">Cloudflare</a></p>
            <p>Исключительно как CDN (Content Delivery Network) для быстрой загрузки используемых ранее упомянутых библиотек.</p>
            <p>=====================</p>
            <p>Все иконки взяты из открытого доступа с сайта <a href="https://www.flaticon.com">www.flaticon.com</a>.</p>
            <p>Авторы: <a href="https://www.flaticon.com/authors/pixel-perfect">Pixel perfect</a>, <a href="https://www.flaticon.com/authors/three-musketeers">Three musketeers</a>, <a href="https://www.flaticon.com/authors/freepik">Freepik</a></p>
            <p>=====================</p>
        `);
    }

    function openCreateModal() {
        closeAllModals();
        document.getElementById('createTemplateModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openListModal() {
        closeAllModals();
        document.getElementById('templatesListModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        renderTemplatesList();
    }

    // Функции для работы с шаблонами
    function addField() {
        const fieldId = Date.now();
        document.getElementById('templateFields').insertAdjacentHTML('beforeend', `
            <div class="templateField" data-id="${fieldId}">
                <input type="text" class="fieldName" placeholder="Название поля">
                <select class="fieldType">
                    <option value="text">Текст</option>
                    <option value="number">Число</option>
                    <option value="date">Дата</option>
                </select>
                <button class="removeFieldBtn" onclick="this.parentElement.remove()">×</button>
            </div>
        `);
    }

    function saveTemplate() {
        const templateName = document.getElementById('templateName').value;
        if (!templateName) return alert('Введите название шаблона!');

        const fields = Array.from(document.querySelectorAll('.templateField')).map(field => ({
            name: field.querySelector('.fieldName').value,
            type: field.querySelector('.fieldType').value
        })).filter(field => field.name);

        if (!fields.length) return alert('Добавьте хотя бы одно поле!');

        const template = { name: templateName, fields };
        if (state.currentEditingIndex !== null) {
            state.templates[state.currentEditingIndex] = template;
            state.currentEditingIndex = null;
        } else {
            state.templates.push(template);
        }

        localStorage.setItem('templates', JSON.stringify(state.templates));
        closeAllModals();
    }

    function renderTemplatesList() {
        const container = document.getElementById('templatesContainer');
        container.innerHTML = state.templates.length ? 
            state.templates.map((template, index) => `
                <div class="templateItem">
                    <h3>${template.name}</h3>
                    <p>Поля: ${template.fields.map(f => f.name).join(', ')}</p>
                    <div class="templateActions">
                        <button onclick="editTemplate(${index})">Редактировать</button>
                        <button onclick="deleteTemplate(${index})">Удалить</button>
                        <button onclick="generateCustomDocx(${index})">Создать документ</button>
                    </div>
                </div>
            `).join('') : '<p>У вас пока нет шаблонов</p>';
    }

    // Функции для форм документов
    function showAkademForm() {
        const modal = createModal(`
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
            <button id="generateAkademDocx" class="primary-btn">Сгенерировать DOCX</button>
        `);

        initDateSelectors(
            ['startDay', 'endDay'],
            ['startMonth', 'endMonth'],
            ['startYear', 'endYear']
        );

        modal.querySelector('#generateAkademDocx').addEventListener('click', () => {
            const napravlenie = document.getElementById('napravlenie').value;
            const code = napravlenie.match(/\d{2}\.\d{2}\.\d{2}/)?.[0] || '';
            const now = new Date();
            
            generateDocx(TEMPLATES.AKADEM, {
                fio: document.getElementById('fio').value,
                institute: document.getElementById('institute').value,
                course: document.getElementById('course').value,
                group: document.getElementById('group').value,
                form: document.getElementById('form').value,
                code, napravlenie,
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
                '3day': now.getDate(),
                '3month': DATA.months[now.getMonth()].name,
                '3year': now.getFullYear()
            }, `akadem_${document.getElementById('fio').value.split(' ')[0]}.docx`);
        });

        // Маска для телефона
        document.getElementById('phone').addEventListener('input', function(e) {
            const x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[1] ? '' : `+${x[1]}${x[2] ? '(' + x[2] : ''}${x[3] ? ')' + x[3] : ''}${x[4] ? '-' + x[4] : ''}${x[5] ? '-' + x[5] : ''}`;
        });
    }

    function showVosstanovlenieForm() {
        const modal = createModal(`
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
            <button id="generateVosstanovlenieDocx" class="primary-btn">Сгенерировать DOCX</button>
        `);

        initDateSelectors(
            ['restoreDay'],
            ['restoreMonth'],
            ['restoreYear']
        );

        modal.querySelector('#generateVosstanovlenieDocx').addEventListener('click', () => {
            const napravlenie = document.getElementById('napravlenie').value;
            const code = napravlenie.match(/\d{2}\.\d{2}\.\d{2}/)?.[0] || '';
            const now = new Date();
            
            generateDocx(TEMPLATES.VOSSTANOVLENIE, {
                fio: document.getElementById('fio').value,
                institute: document.getElementById('institute').value,
                course: document.getElementById('course').value,
                group: document.getElementById('group').value,
                form: document.getElementById('form').value,
                code, napravlenie,
                profile: document.getElementById('profile').value,
                obrtype: document.getElementById('obrtype').value,
                phone: document.getElementById('phone').value,
                '1day': document.getElementById('restoreDay').value,
                '1month': document.getElementById('restoreMonth').value,
                '1year': document.getElementById('restoreYear').value,
                '2day': now.getDate(),
                '2month': DATA.months[now.getMonth()].name,
                '2year': now.getFullYear()
            }, `vosstanovlenie_${document.getElementById('fio').value.split(' ')[0]}.docx`);
        });

        // Маска для телефона
        document.getElementById('phone').addEventListener('input', function(e) {
            const x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[1] ? '' : `+${x[1]}${x[2] ? '(' + x[2] : ''}${x[3] ? ')' + x[3] : ''}${x[4] ? '-' + x[4] : ''}${x[5] ? '-' + x[5] : ''}`;
        });
    }

    // Остальные функции форм (showCourseForm, showVkrForm и т.д.) остаются аналогичными, 
    // но используют общие функции generateDocx, initDateSelectors и другие

    // Глобальные функции
    window.editTemplate = function(index) {
        state.currentEditingIndex = index;
        const template = state.templates[index];
        document.getElementById('templateName').value = template.name;
        document.getElementById('templateFields').innerHTML = template.fields.map(field => `
            <div class="templateField" data-id="${Date.now()}">
                <input type="text" class="fieldName" placeholder="Название поля" value="${field.name}">
                <select class="fieldType">
                    <option value="text" ${field.type === 'text' ? 'selected' : ''}>Текст</option>
                    <option value="number" ${field.type === 'number' ? 'selected' : ''}>Число</option>
                    <option value="date" ${field.type === 'date' ? 'selected' : ''}>Дата</option>
                </select>
                <button class="removeFieldBtn" onclick="this.parentElement.remove()">×</button>
            </div>
        `).join('');
        openCreateModal();
    };

    window.deleteTemplate = function(index) {
        if (confirm('Вы уверены, что хотите удалить этот шаблон?')) {
            state.templates.splice(index, 1);
            localStorage.setItem('templates', JSON.stringify(state.templates));
            renderTemplatesList();
        }
    };

    window.generateCustomDocx = async function(index) {
        alert('Функция генерации документа для пользовательских шаблонов будет реализована позже');
    };

    // Запуск приложения
    initApp();
});