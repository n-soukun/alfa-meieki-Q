<?php

  /**
   * 送信用jsonの生成
   */
  function generateJson($reply,$placeholder,$choices,$nextStep){
    $return = array(
      'reply' => $reply,
      'placeholder' => $placeholder,
      'choices' => $choices,
      'next_step' => $nextStep
    );
    return json_encode($return, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE);
  }
  
  //json読み込み
  $url = "../data/game.json";
  $json = file_get_contents($url);
  $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
  $game = json_decode($json);

  //POSTデータの受け取り
  $step = isset($_POST['step']) ? $_POST['step'] : null;
  $message = isset($_POST['message']) ? $_POST['message'] : null;

  if($step == "first" && $message == "first"){
    $next = 0;
    $step = 0;
    $replayText = $game->steps[$step]->messages->messages;
  }else{
    //Reactionの準備
    $next = 0;
    foreach ($game->steps[$step]->responses as $response){
      if($response->filter == $message){
        $next = $response->next;
        break;
      }
    }

    if(!$next == 0){
      $replayText = $game->steps[$next]->messages->messages;
      if($game->steps[$next]->messages->return){
        $next = $step;
      }
    }else{
      $replayText = $game->steps[$step]->other->messages;
      $next = $game->steps[$step]->other->next;
      if($step != $next){
        $nextMessages = $game->steps[$next]->messages->messages;
        if($game->steps[$next]->messages->return){
          $next = $step;
        }
        array_merge($replayText, array($nextMessages));
      }
    }
  }

  print generateJson($replayText,null,null,$next);
?>