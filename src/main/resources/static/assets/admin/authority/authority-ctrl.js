app.controller("authority-ctrl", function($scope,$http, $location){
	$scope.roles = [];
	$scope.admins = [];
	$scope.authorities = [];
	
	$scope.initialize = function(){
		//load all roles
		$http.get("/rest/roles").then(resp => {
			$scope.roles = resp.data;
			console.log($scope.roles)
		})
		
		//load staffs and directors (administrators)
		$http.get("/rest/accounts?admin=true").then(resp => {
			$scope.admins = resp.data;
			console.log($scope.admins)
		})
		
		//load authorites of staffs and directors
		$http.get("/rest/authorities?admin=true").then(resp => {
			$scope.authorities = resp.data;
			console.log($scope.authorities)
		}).catch(error => {	
			$location.path("/unauthorized");
			console.log("Error", error);
		})
	}
	
	$scope.authority_of = function(acc, role){
		if($scope.authorities){
			return $scope.authorities.find(ur => ur.account.username == acc.username && ur.role.id == role.id);
		}
		
	}
	
	$scope.authority_changed = function(acc, role){
		var authority = $scope.authority_of(acc, role);
		if(authority){// đã cấp quyền => thu hồi quyền (xóa)
			$scope.revoke_authority(authority);
		}else{// chưa được cấp quyền => cấp quyền (thêm mới)
			authority = {account: acc, role: role};
			$scope.grant_authority(authority);
			
		}
	}
	
	
	//Xóa authority
	$scope.revoke_authority = function(authority){
		$http.delete(`/rest/authorities/${authority.id}`).then(resp => {
			var index = $scope.authorities.findIndex(a => a.id == authority.id);
			$scope.authorities.splice(index, 1);
			alert("Thu hồi quyền sử dụng thành công!")
		}).catch(error => {
			alert("Thu hồi quyền sử dụng thất bại!")
			console.log("Error", error);
		})
	}
	
	//Thêm mới authority
	$scope.grant_authority = function(authority){
		$http.post(`/rest/authorities`,authority).then(resp => {
			$scope.authorities.push(resp.data)
			alert("Cấp quyền sử dụng thành công!")
		}).catch(error => {
			alert("Cấp quyền sử dụng thất bại!");
			console.log("Error", error);
		})
	}
	
	$scope.initialize();
	
	
	
	
})