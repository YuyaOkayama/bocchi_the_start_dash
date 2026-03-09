window.onload = function () {
    let f_mark_ele = document.getElementById('f_marks_sli');
    let l_mark_ele = document.getElementById('l_marks_sli');
    var obj_f_m = document.getElementById('f_marks_sec');
    var obj_l_m = document.getElementById('l_marks_sec');
    
    obj_f_m.textContent = f_mark_ele.value + "秒";
    obj_l_m.textContent = l_mark_ele.value + "秒";

    f_mark_ele.addEventListener('input', () => inputChange(f_mark_ele, obj_f_m, l_mark_ele, obj_l_m, 'min'));
    l_mark_ele.addEventListener('input', () => inputChange(l_mark_ele, obj_l_m, f_mark_ele, obj_f_m, 'max'));

    let f_set_ele = document.getElementById('f_set_sli');
    let l_set_ele = document.getElementById('l_set_sli');
    var obj_f_s = document.getElementById('f_set_sec');
    var obj_l_s = document.getElementById('l_set_sec');

    obj_f_s.textContent = f_set_ele.value + "秒";
    obj_l_s.textContent = l_set_ele.value + "秒";

    f_set_ele.addEventListener('input', () => inputChange(f_set_ele, obj_f_s, l_set_ele, obj_l_s, 'min'));
    l_set_ele.addEventListener('input', () => inputChange(l_set_ele, obj_l_s, f_set_ele, obj_f_s, 'max'));

    let f_start_ele = document.getElementById('f_start_sli');
    let l_start_ele = document.getElementById('l_start_sli');
    var obj_f_st = document.getElementById('f_start_sec');
    var obj_l_st = document.getElementById('l_start_sec');

    obj_f_st.textContent = f_start_ele.value + "秒";
    obj_l_st.textContent = l_start_ele.value + "秒";

    f_start_ele.addEventListener('input', () => inputChange(f_start_ele, obj_f_st, l_start_ele, obj_l_st, 'min'));
    l_start_ele.addEventListener('input', () => inputChange(l_start_ele, obj_l_st, f_start_ele, obj_f_st, 'max'));
}

function inputChange(slider, objtxt, relatedSlider, relatedObjtxt, type) {
    const v = parseFloat(slider.value);
    const relatedV = parseFloat(relatedSlider.value);

    // type === 'min' の場合、sliderは「最速」、relatedSliderは「最遅」
    if (type === 'min' && v > relatedV) {
        relatedSlider.value = v;
        relatedObjtxt.textContent = v + "秒";
    }

    // type === 'max' の場合、sliderは「最遅」、relatedSliderは「最速」
    if (type === 'max' && v < relatedV) {
        relatedSlider.value = v;
        relatedObjtxt.textContent = v + "秒";
    }

    objtxt.textContent = v + "秒";
}

let isPlaying = false;
let currentTimeout = null;
let currentAudio = null;

function clicked() {
    const playBtn = document.getElementById('play_btn');
    const statusText = document.getElementById('status_text');

    if (isPlaying) {
        // 再生停止処理
        isPlaying = false;
        playBtn.textContent = "再生";
        statusText.style.display = "none";

        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        return;
    }

    // 再生開始処理
    isPlaying = true;
    playBtn.textContent = "停止";
    statusText.style.display = "inline";

    const fMarks = parseFloat(document.getElementById('f_marks_sli').value) || 0;
    const lMarks = parseFloat(document.getElementById('l_marks_sli').value) || 0;

    const fSet = parseFloat(document.getElementById('f_set_sli').value) || 0;
    const lSet = parseFloat(document.getElementById('l_set_sli').value) || 0;

    const fStart = parseFloat(document.getElementById('f_start_sli').value) || 0;
    const lStart = parseFloat(document.getElementById('l_start_sli').value) || 0;

    // 再生〜on your marks間のタイムラグ（ミリ秒）
    const delay1 = getRandomDelay(fMarks, lMarks);

    currentTimeout = setTimeout(() => {
        if (!isPlaying) return;
        currentAudio = new Audio('sounds/on_your_marks.wav');
        currentAudio.play().catch(e => console.error(e));

        // 再生完了時のイベントリスナー
        currentAudio.addEventListener('ended', () => {
            if (!isPlaying) return;
            // on your marks〜set間のタイムラグ（ミリ秒）
            const delay2 = getRandomDelay(fSet, lSet);
            currentTimeout = setTimeout(() => {
                if (!isPlaying) return;
                currentAudio = new Audio('sounds/set.wav');
                currentAudio.play().catch(e => console.error(e));

                currentAudio.addEventListener('ended', () => {
                    if (!isPlaying) return;
                    // set〜start間のタイムラグ（ミリ秒）
                    const delay3 = getRandomDelay(fStart, lStart);
                    currentTimeout = setTimeout(() => {
                        if (!isPlaying) return;
                        currentAudio = new Audio('sounds/start.mp3');
                        currentAudio.play().catch(e => console.error(e));

                        currentAudio.addEventListener('ended', () => {
                            // すべて再生完了したら状態をリセット
                            isPlaying = false;
                            playBtn.textContent = "再生";
                            statusText.style.display = "none";
                            currentAudio = null;
                            currentTimeout = null;
                        });
                    }, delay3);
                });
            }, delay2);
        });
    }, delay1);
}

// 最小秒数と最大秒数からランダムなミリ秒を生成する関数
function getRandomDelay(minSec, maxSec) {
    const min = Math.min(minSec, maxSec);
    const max = Math.max(minSec, maxSec);
    return (Math.random() * (max - min) + min) * 1000;
}

// リセットボタン押下時の処理
function reset() {
    location.reload();
}
