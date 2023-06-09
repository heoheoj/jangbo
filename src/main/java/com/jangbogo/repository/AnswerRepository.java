package com.jangbogo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jangbogo.domain.Board.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
	
	Page<Answer> findAllByOrderByParentIdDescDepthAscCreateAtDesc(Pageable pageable);

}
