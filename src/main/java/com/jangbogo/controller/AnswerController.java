package com.jangbogo.controller;

import java.security.Principal;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jangbogo.domain.Board.Answer;
import com.jangbogo.domain.Board.Board;
import com.jangbogo.domain.Board.Question;
import com.jangbogo.domain.member.entity.Member;
import com.jangbogo.dto.AnswerDto;
import com.jangbogo.service.AnswerService;
import com.jangbogo.service.MemberService;
import com.jangbogo.service.QuestionService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class AnswerController {
	private final QuestionService questionService;
	private final AnswerService answerService; 
	private final MemberService memberService;

	@PostMapping("/board/answer/create/{id}")
	public void answerCreate(@RequestBody AnswerDto answerDto,@PathVariable("id") Long id ,BindingResult bindingResult, Principal principal) {
		// @RequestBody 어노테이션을 추가하여 Request Body에서 데이터를 읽어옴
		System.out.println("create controller 호출");
		if (bindingResult.hasErrors()) {
			System.out.println("create controller 호출");

		}	
		System.out.println("create controller 호출");

		Question question = this.questionService.getQuestion(id);
		Member member = this.memberService.getMember(principal.getName());

		this.answerService.create(question,answerDto.getContent() ,member);

	}
		
	//답변수정 
    @GetMapping("/answer/modify/{id}")
    public String answerModify(AnswerDto answerDto, @PathVariable("id") Long id, Principal principal) {
        
    	Answer answer = this.answerService.getAnswer(id);
    	
        if (!answer.getName().getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정권한이 없습니다.");
        }
        answerDto.setContent(answer.getContent());
        return "answer_form";
    }
    
    
    //답변 수정
    @PostMapping("/answer/modify/{id}")
    public String answerModify(@Valid AnswerDto answerDto, BindingResult bindingResult,
            @PathVariable("id") Long id, Principal principal) {
        if (bindingResult.hasErrors()) {
            return "answer_form";
        }
        Answer answer = this.answerService.getAnswer(id);
        if (!answer.getName().getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수정권한이 없습니다.");
        }
        this.answerService.modify(answer, answerDto.getContent());

        return String.format("redirect:/question/detail/%s#answer_%s", 
                answer.getQuestion().getId(), answer.getId());
    }
    
    //답변 삭제 
    @GetMapping("/answer/delete/{id}")
    public String answerDelete(Principal principal, @PathVariable("id") Long id) {
    	
        Answer answer = this.answerService.getAnswer(id);
        
        if (!answer.getName().getEmail().equals(principal.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제권한이 없습니다.");
        }
        
        this.answerService.delete(answer);
        
        return String.format("redirect:/question/detail/%s", answer.getQuestion().getId());
    }
    
    @GetMapping("/answer/vote/{id}")
    public String answerVote(Principal principal, @PathVariable("id") Long id) {
        Answer answer = this.answerService.getAnswer(id);
        Member member = this.memberService.getMember(principal.getName());
        this.answerService.vote(answer, member);

        return String.format("redirect:/question/detail/%s#answer_%s", 
                answer.getQuestion().getId(), answer.getId());
    }
    
    @GetMapping("/answer/report/{id}")
    public String answerReport(Principal principal, @PathVariable("id") Long id) {
        Answer answer = this.answerService.getAnswer(id);
        Member member = this.memberService.getMember(principal.getName());
        this.answerService.report(answer, member);

        return String.format("redirect:/question/detail/%s#answer_%s", 
                answer.getQuestion().getId(), answer.getId());
    }
    
//	@PostMapping("/board/answer/list/{id}")
//	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//	public ResponseEntity<Page<Answer>> answerList(
//			@RequestParam(value = "page", defaultValue = "0") int page,
//			@RequestParam(value = "kw", defaultValue = "") String kw) {
//
//		Page<Answer> paging = this.answerService.getList(page);
//		System.out.println("answerlist 호출");
//
//		if (paging.getContent().isEmpty()) {
//			return ResponseEntity.noContent().build(); // 비어있는 경우 null 반환
//		}
//
//		return ResponseEntity.ok(paging); // 비어있지 않은 경우 Page 객체 반환
//	}
    
    
    
//	@GetMapping("/answer/list/{id}")
//	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//	public ResponseEntity<Page<Answer>> answerList(
//			@RequestParam(value = "page", defaultValue = "0") int page,
//			@RequestParam(value = "kw", defaultValue = "") String kw) {
//
//		Page<Answer> paging = this.answerService.getList(page);
//
//
//		if (paging.getContent().isEmpty()) {
//			return ResponseEntity.noContent().build(); // 비어있는 경우 null 반환
//		}
//
//		return ResponseEntity.ok(paging); // 비어있지 않은 경우 Page 객체 반환
//	}

}
