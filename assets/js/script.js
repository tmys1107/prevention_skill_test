$(function(){
    $.ajax({
        /*==========================================================================
        # ファイルの読み込み
        ========================================================================== */
        url: './test/sasatu.txt',
        success: function(data){
            var quiz_list = [];
            var line = [];
            var f = data;
            var i = 0;
            var quiz_num = 0;
            var choice_value = 0;
            var now_quiz = [];
            var true_answer = 0;
            var quiz_number = 0;
            /*==========================================================================
            # function
            ========================================================================== */
            //問題の読み込み
            function getQuiz(){
                // quiz_list[問題番号][問題分,問1,問2,問3,問4,答え番号,解説]
                f = f.split(/\r\n|\n|\r/g);
                console.log(f.length);
                for(i = 0; i<f.length; i++){
                    line = f[i].replace(/\r\n|\n|\r/g,"");
                    line = line.split(",");
                    quiz_list.push(line);
                    console.log(quiz_list[i]);
                }
            }

            //問題表示
            function showQuiz() {
                // 問題番号をランダムに出力
                quiz_num = Math.floor( Math.random() * (quiz_list.length - 1) ) ;
                quiz = quiz_list[quiz_num];
                // 問題の表示
                $("#js-question-number").text(`問${quiz_number + 1}`);
                $("#js-question").text(quiz[0]);
                for(i=1; i<5; i++){
                    quiz[i] = quiz[i].replace(/\(1\)|\(2\)|\(3\)|\(4\)/g,"");
                    quiz[i] = quiz[i].replace(/（/g,"");
                    $(`#js-choice-${i}`).text(`（${i}）${quiz[i]}`);
                }
                //表示した問題を再度表示しないようリストから削除
                quiz_list = quiz_list.filter(function(v){
                    return v !== quiz;
                });

                //表示中の問題を覚えておく
                now_quiz = quiz;
            }

            //解説はxを改行に変換し表示＆選択番号・正解番号の表示
            function showExplanation(){
                now_quiz[6] = now_quiz[6].replace(/x/g, '<span>');
                //解説の表示
                $(".explanation-wrap").slideDown();
                $("#js-explanation").html(now_quiz[6]);
                // 選択番号・正解番号の表示
                $("#js-choiceAnswer").text(choice_value);
                $("#js-answer").text(quiz[5]);
            }


            //〇×の表示をフェードインフェードアウト
            function trueFalse(){
                if(choice_value === Number(quiz[5])){
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
                    getQuiz();
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
                            if(choice_value === Number(quiz[5])){
                                true_answer++;
                            }else{
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
                        showQuiz();
                    }
                });
            }


            /*==========================================================================
            # メイン
            ========================================================================== */
            $(function() {
                // 問題の表示
                getQuiz();
                showQuiz();
                checkAnswer();
                nextQuiz();
                reset();
            });
        }
    });
});

