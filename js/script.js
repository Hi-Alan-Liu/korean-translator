let tableData = [];

window.onload = async () => {
    await getData();
    loadingComplete();
}

async function getData() {
    try {
        const response = await fetch('./data/data.xlsx');
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            tableData = data;
        });
    } catch (error) {
        tableData = [
            {"type": "餐廳", "tw": "你們有中文/英文的菜單嗎?", "ko": "중국어/영어 메뉴가 있어요?"},
            {"type": "餐廳", "tw": "請問這個可以外帶嗎?請幫我打包", "ko": "이걸 포장 해도돼요? 이걸 포장해 주세요"},
            {"type": "餐廳", "tw": "請幫我做不辣的", "ko": "안 맵게 해주세요"},
            {"type": "餐廳", "tw": "請給我菜單", "ko": "메뉴 주세요"},
            {"type": "餐廳", "tw": "請給我水", "ko": "물 주세요"},
            {"type": "餐廳", "tw": "請再加一點小菜", "ko": "반찬 더 주세요"},
            {"type": "餐廳", "tw": "請幫我結帳", "ko": "계산 해주세요"}
        ];
    }
}

function loadingComplete() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = "none";
    }

    $('#koreanTable').DataTable({
        data: tableData,
        columns: [
            { data: 'type', title: '' },
            { data: 'tw', title: '中文' },
            { data: 'ko', title: '韓文' },
            { 
                data: null,
                title: '功能',
                render: function(data, type, row) {
                    return `
                        <div class="text-center">
                            <button type="button" class="btn btn-primary btn-sm" onclick="openKoreanModal('${row.tw}', '${row.ko}')">
                                <i class="bi bi-play-fill"></i>
                            </button>
                        </div>
                    `;
                },
                orderable: false
            }
        ],
        pageLength: 10,
        paging: false,
        info: false,
    });
}

function speak(textToSpeak) {
    if (textToSpeak) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'ko-KR';

        // Find the button element
        const button = document.querySelector('#koreanModal .modal-body button');
        const icon = button.querySelector('i');

        utterance.onboundary = (event) => {
            console.log('Speech boundary event');
        };

        utterance.onstart = function(event) {
            console.log("Speech synthesis started");
            icon.classList.remove('bi-play-fill');
            icon.classList.add('bi-pause-fill');
        };

        utterance.onend = function(event) {
            console.log("Speech synthesis ended");
            icon.classList.remove('bi-pause-fill');
            icon.classList.add('bi-play-fill');
        };

        synth.speak(utterance);
    } else {
        alert('No text to speak!');
    }
}

function openKoreanModal(chineseText, koreanText) {
    const modal = new bootstrap.Modal(document.getElementById('koreanModal'));
    document.getElementById('koreanModalLabel').innerText = '韓語翻譯';
    document.querySelector('#koreanModal .modal-body h3:nth-of-type(1)').innerText = koreanText;
    document.querySelector('#koreanModal .modal-body h3:nth-of-type(2)').innerText = chineseText;
    document.querySelector('#koreanModal .modal-body button').setAttribute('onclick', `speak('${koreanText}')`);
    modal.show();
}