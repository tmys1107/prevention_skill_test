$(function(){
    $.ajax({
        /*==========================================================================
        # ファイルの読み込み
        ========================================================================== */
        url: './test/sasatu.csv',
        success: function(data){
            let quiz_list = [];
            let quiz_table = [];
            let line = [];
            let f = data;
            let i = 0;
            let quiz_num = 0;
            let choice_value = 0;
            let now_quiz = [];
            let true_answer = 0;
            let quiz_number = 0;
            /*==========================================================================
            # function
            ========================================================================== */
            //問題の読み込み
            function initQuiz(){
                // quiz_list[問題番号][問題分,問1,問2,問3,問4,答え番号,解説]
                f = f.split(/\r\n|\n|\r/g);
                for(i = 0; i<f.length; i++){
                    line = f[i].replace(/\r\n|\n|\r/g,"");
                    line = line.split(",");
                    quiz_list.push(line);
                }
            }

            function getQuiz() {
                // 問題番号をランダムに出力
                quiz_num = Math.floor( Math.random() * (quiz_list.length - 1) ) ;
                quiz_table = quiz_list[quiz_num];
                quiz = {
                    "question":quiz_table[1],
                    "choice":[
                        quiz_table[2],
                        quiz_table[3],
                        quiz_table[4],
                        quiz_table[5]
                        ],
                    "answer_num":quiz_table[6],
                    "explanation":quiz_table[7]
                }
            }

            //問題表示
            function showQuiz() {
                getQuiz();
                // 問題の表示
                $("#js-question-number").text(`問${quiz_number + 1}`);
                $("#js-question").text(quiz["question"]);
                for(i=0; i<4; i++){
                    quiz["choice"][i] = quiz["choice"][i].replace(/\(1\)|\(2\)|\(3\)|\(4\)/g,"");
                    quiz["choice"][i] = quiz["choice"][i].replace(/（/g,"");
                    $(`#js-choice-${i+1}`).text(`${quiz["choice"][i]}`);
                }
            }

            function removeQuiz() {
                //表示した問題を再度表示しないようリストから削除
                quiz_list = quiz_list.filter(function(v){
                    return v !== quiz;
                });
            }

            //解説の表示＆選択番号・正解番号の表示
            function showExplanation(){
                //(1)～(4)があればlistタグで囲む
                const pattern =/\(1\).*\(2\).*\(3\).*\(4\).*/i;
                if(pattern.test(quiz["explanation"])) {
                    quiz["explanation"] = quiz["explanation"].replace(/\(1\)/i,'<ul><li>');
                    quiz["explanation"] = quiz["explanation"].replace(/\(2\)/i,'</li><li>');
                    quiz["explanation"] = quiz["explanation"].replace(/\(3\)/i,'</li><li>');
                    quiz["explanation"] = quiz["explanation"].replace(/\(4\)/i,'</li><li>');
                    quiz["explanation"] += '</li></ul>';
                }
                //解説の表示
                $(".explanation-wrap").slideDown();
                $("#js-explanation").html(quiz["explanation"]);
                // 選択番号・正解番号の表示
                $("#js-choiceAnswer").text(choice_value);
                $("#js-answer").text(quiz["answer_num"]);
            }


            //〇×の表示をフェードインフェードアウト
            function trueFalse(){
                if(choice_value === Number(quiz["answer_num"])){
                    $("#js-true").addClass("is-show");
                }else{
                    $("#js-false").addClass("is-show");
                }
                $("#js-trueFalse").fadeIn("slow",function(){
                    $(this).delay(500).fadeOut("slow");
                });
            }

            // 20門解答後の結果発表
            function judge(){
                $("#js-result-txt").html(`${quiz_number}門中${true_answer}門正解です<br>正答率${(true_answer/quiz_number)*100}％`);
                if(true_answer >= 12){
                    $("#js-result-record-txt").html(`合格`);
                }else{
                    $("#js-result-record-txt").html(`不合格`);
                }
                $("#js-main").hide();
                $("#js-result").fadeIn();
            }

            // 最初からやり直しボタン
            function reset(){
                $(`.reset-btn`).click(function(){
                    quiz_list.splice(0);
                    line.splice(0);
                    now_quiz.splice(0);
                    f = data;
                    quiz_num = 0;
                    choice_value = 0;
                    true_answer = 0;
                    quiz_number = 0;
                    initQuiz();
                    $("#js-result").hide();
                    $("#js-main").fadeIn();
                    showQuiz();
                });
            }


            //答えをクリック
            function checkAnswer(){
                $(`.choice-btn`).click(function(){
                    quiz_number++;
                    // 正解の判定
                    for(i=1; i<5; i++){
                        if ($(this).hasClass(`choice-btn-${i}`)) {
                            choice_value = i;
                            if(choice_value === Number(quiz["answer_num"])){
                                true_answer++;
                            }
                        }
                    }
                    // 解答ボタンを非表示
                    $(".choice-btn-wrap").removeClass("is-show");

                    //〇×を表示
                    trueFalse();
                    // 解説を表示
                    showExplanation();

                    //20門回答した場合
                    if(quiz_number === 20){
                        $("#js-next-btn").text("結果の確認");
                    } else{
                        $("#js-next-btn").text("次の問題");
                    }
                });
            }

            function nextQuiz(){
                $(`#js-next-btn`).click(function(){
                    $(".explanation-wrap,#js-true,#js-false").removeClass("is-show");
                    $(".explanation-wrap").hide();
                    $(".choice-btn-wrap").addClass("is-show");
                    $('body, html').animate({
                        scrollTop: 0
                    }, 300);
                    if(quiz_number === 20){
                        judge();
                    }else{
                        removeQuiz();
                        showQuiz();
                    }
                });
            }


            /*==========================================================================
            # メイン
            ========================================================================== */
            $(function() {
                // 問題の表示
                initQuiz();
                showQuiz();
                checkAnswer();
                nextQuiz();
                reset();
            });
        }
    });
});

