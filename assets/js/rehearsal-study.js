const processSection = document.querySelector('#process');
const processIndex = processSection?.querySelector('.section-index');
const processTitle = processSection?.querySelector(':scope > h2');
const processNote = processSection?.querySelector('.process-note');
const processIntro = processSection?.querySelector('.process-intro');

if (processIndex) processIndex.textContent = '[03] WORKFLOW';
if (processTitle) processTitle.innerHTML = 'FROM QUESTION<br>TO FINAL CUT.';
if (processNote && processTitle) {
  processNote.textContent = '《人生彩排》第二季分析';
  processNote.classList.add('process-analysis-note');
  processTitle.insertAdjacentElement('afterend', processNote);
}

if (processIntro && !document.querySelector('#process .process-turn')) {
  processIntro.insertAdjacentHTML(
    'afterend',
    `<aside class="process-turn" aria-labelledby="process-turn-title">
      <p class="process-turn__label">MY TURNING POINT / 观看转折</p>
      <div class="process-turn__body">
        <h3 id="process-turn-title">我曾怀疑HBO看走了眼。<br>看完以后，只剩下一脸肃静。</h3>
        <div>
          <p>Nathan既是制作人，也是主角。他像一个固执的空难研究者，试图找到那些黑匣子无法完整还原、却始终潜伏在驾驶舱空气里的东西——机长与副机长之间看不见的沟通暗流。</p>
          <p>一个喜剧演员，却主动扛起了沉重、艰难而且吃力不讨好的选题。起初我甚至怀疑，HBO为什么要把如此奢侈的制作费交给一个看起来哗众取宠的人？但看完以后，我只剩下一脸肃静：<strong>原来小丑竟是我自己。</strong></p>
          <p>Nathan不符合传统英雄的样子。他不英俊，也不舌灿莲花，花白的乱发、微微佝偻的背，让他站在人群中并不醒目。可他愿意用漫长的时间和最荒诞的方法，寻找一个被行业规则与国家体系层层包裹的答案。</p>
        </div>
      </div>
      <ol class="process-turn__escalation">
        <li><b>01</b><span>他1:1还原机场，调动大量演员模拟机场生态，只为观察飞行员在起飞前如何相遇、错过与沉默。</span></li>
        <li><b>02</b><span>他训练三只克隆犬，复刻原犬的成长环境，试探“复制条件”是否真的可以复制性格与命运。</span></li>
        <li><b>03</b><span>他从穿尿布的婴儿开始重走萨利机长的一生，把英雄传记变成荒谬却具体的身体体验。</span></li>
        <li><b>04</b><span>他包装出一场近乎胡闹的歌唱海选，让副机长担任评委，只为观察他们如何拒绝别人、如何给出负面反馈。</span></li>
        <li><b>05</b><span>他重新排演自己与平台高层的冲突，也把亲密关系带进实验，承认自己同样害怕表达和被拒绝。</span></li>
        <li><b>06</b><span>每一次试错都荒诞又诚恳，直到他亮出底牌：亲自驾驶波音737，带着一众演员升空，把两年的研究变成一次真实检验。</span></li>
      </ol>
      <div class="process-turn__climax">
        <p>他想理解的，是机长为何常被想象成权威、寡言、固执而拒绝沟通的人。飞行结束后，他在乘客的掌声中走下舷梯；而当神经影像检查结果终于抵达时，他却在《Bring Me to Life》的歌声中删除了那条语音，没有听取那个可能改变他飞行生涯的答案。</p>
        <p>这不是一个可以被简单肯定的决定，却让整季主题在他身上闭环：他曾试图理解飞行员为何回避求助、拒绝暴露不确定，最后也选择依靠经验、自信与热爱继续飞行。<strong>他读懂他们的那一刻，也成为了他们。</strong></p>
      </div>
    </aside>`,
  );
}
