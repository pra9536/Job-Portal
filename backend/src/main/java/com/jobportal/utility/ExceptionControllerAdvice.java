package com.jobportal.utility;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.jobportal.exception.JobPortalException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class ExceptionControllerAdvice {
	
	@Autowired
	private Environment environment;
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorInfo>generalExceptionHandler(Exception exception){
		ErrorInfo error=new ErrorInfo(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	private String getErrorMessage(String errorCode) {
		String msg = environment.getProperty(errorCode);
		if (msg != null) {
			return msg;
		}
		switch (errorCode) {
			case "USER_FOUND":
				return "Email is already registered. Please login or use a different email.";
			case "USER_NOT_FOUND":
				return "User not found. Please register first.";
			case "INVALID_CREDENTIALS":
				return "Incorrect password. Please try again.";
			case "OTP_NOT_FOUND":
				return "OTP not found or expired. Please resend.";
			case "OTP_INCORRECT":
				return "Incorrect OTP. Please enter the correct code.";
			case "JOB_NOT_FOUND":
				return "Job post not found.";
			case "JOB_APPLIED_ALREADY":
				return "You have already applied for this job.";
			default:
				return errorCode;
		}
	}

	@ExceptionHandler(JobPortalException.class)
	public ResponseEntity<ErrorInfo>jobPortalExceptionHandler(JobPortalException exception){
		String msg=getErrorMessage(exception.getMessage());
		ErrorInfo error=new ErrorInfo(msg, HttpStatus.INTERNAL_SERVER_ERROR.value(), LocalDateTime.now());
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	@ExceptionHandler({MethodArgumentNotValidException.class, ConstraintViolationException.class})
    public ResponseEntity<ErrorInfo> validatorExceptionHandler(Exception exception) {
        String errorMsg;
        if (exception instanceof MethodArgumentNotValidException manvException) {
            errorMsg = manvException.getBindingResult().getAllErrors().stream().map(ObjectError::getDefaultMessage)
                    .collect(Collectors.joining(", "));
        } else {    
            ConstraintViolationException cvException = (ConstraintViolationException) exception;
            errorMsg = cvException.getConstraintViolations().stream().map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
        }
        ErrorInfo errorInfo = new ErrorInfo();
        errorInfo.setErrorMessage(errorMsg);
        errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());
        errorInfo.setTimeStamp(LocalDateTime.now());
        return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
	}
}
