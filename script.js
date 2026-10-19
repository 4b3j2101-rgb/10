const today = new Date();
today.setHours(0, 0, 0, 0);

const firstShowDate = new Date(2026, 10, 7);
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const daysUntilShow = Math.round((firstShowDate - today) / millisecondsPerDay);
const countdown = document.getElementById('倒數');

if (countdown) {
  if (daysUntilShow > 0) {
    countdown.textContent = `距離台北首場還有 ${daysUntilShow} 天`;
  } else if (daysUntilShow < 0) {
    countdown.textContent = `台北首場已於 ${Math.abs(daysUntilShow)} 天前舉行`;
  } else {
    countdown.textContent = '台北首場就在今天';
  }
}

const playButton = document.getElementById('play-toggle');
const progressInput = document.getElementById('track-progress');
const currentTimeLabel = document.getElementById('track-current');
const durationLabel = document.getElementById('track-duration');
const playerNote = document.getElementById('player-note');
const audioTrack = document.getElementById('audio-track');
const previewDuration = 30;

function formatTime(seconds) {
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}

function updatePlayer() {
  const currentSeconds = Math.min(audioTrack.currentTime || 0, previewDuration);
  progressInput.value = String(currentSeconds);
  currentTimeLabel.textContent = formatTime(currentSeconds);
  currentTimeLabel.dateTime = `PT${Math.floor(currentSeconds)}S`;
}

function setPlaybackState(playing) {
  playButton.textContent = playing ? '暫停' : '播放';
  playButton.setAttribute('aria-label', playing ? '暫停試聽' : '播放試聽');
  playButton.setAttribute('aria-pressed', String(playing));
}

audioTrack.addEventListener('loadedmetadata', () => {
  const availableDuration = Math.min(audioTrack.duration, previewDuration);
  progressInput.max = String(availableDuration);
  durationLabel.textContent = formatTime(availableDuration);
});

audioTrack.addEventListener('timeupdate', () => {
  updatePlayer();
  if (audioTrack.currentTime >= previewDuration) {
    audioTrack.pause();
    audioTrack.currentTime = previewDuration;
    setPlaybackState(false);
    playerNote.textContent = '試聽播放完畢，可拖曳進度再次聆聽。';
  }
});

audioTrack.addEventListener('ended', () => {
  setPlaybackState(false);
  playerNote.textContent = '試聽播放完畢，可拖曳進度再次聆聽。';
  updatePlayer();
});

audioTrack.addEventListener('error', () => {
  playerNote.textContent = '音樂檔無法載入，請確認 MP4 檔案格式與路徑。';
});

playButton.addEventListener('click', async () => {
  if (audioTrack.paused) {
    if (audioTrack.currentTime >= previewDuration || audioTrack.ended) {
      audioTrack.currentTime = 0;
    }

    try {
      await audioTrack.play();
      setPlaybackState(true);
      playerNote.textContent = '正在播放 30 秒歌曲試聽。';
    } catch {
      playerNote.textContent = '目前無法播放音樂，請確認瀏覽器支援此 MP4 音訊。';
    }
  } else {
    audioTrack.pause();
    setPlaybackState(false);
    playerNote.textContent = '播放已暫停。';
  }
});

progressInput.addEventListener('input', () => {
  audioTrack.currentTime = Number(progressInput.value);
  updatePlayer();
});
