package com.poly.service;

import java.util.List;

import com.poly.entity.Account;

public interface AccountService {

	public List<Account> findAll();
	Account findById(String username);
	public List<Account> getAdministrators();
	
}
