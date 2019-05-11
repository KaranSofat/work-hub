import { Component, OnInit } from '@angular/core';
import { AdminService } from "./../services/admin.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-admin-cateogry',
  templateUrl: './admin-cateogry.component.html',
  styleUrls: ['./admin-cateogry.component.css']
})
export class AdminCateogryComponent implements OnInit {

  constructor(private adminService: AdminService,private modalService: BsModalService,private ngxService: NgxUiLoaderService,private router : Router,private toastr: ToastrService) { }
  listCat:any;
  totalEntries:any;
  perPage = 10;
  catId:'';
  modalRefAdd:BsModalRef | null;
  modalRefEdit:BsModalRef | null;
  name:"";
  modalRefDel:BsModalRef | null;
  id:''
  searchText:'';
  p = 1;
  ngOnInit() {
    this.ngxService.start()
    this.adminService.getCategories().subscribe(
      res => {
        this.listCat = res['success'];
        this.ngxService.stop();
        this.totalEntries = this.listCat.length;
      },
      err => { 
        this.ngxService.stop();
        
      }
    )
  }

  addCat(template: any){
    this.modalRefAdd = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  editCat(template: any,cat){
    this.name = cat.name;
    this.catId = cat.id
    this.modalRefEdit = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  addCategory(){
    let {name} = this;
    if(name){
      this.ngxService.start()
      this.adminService.addCategory({name:name}).subscribe((result) => {
        this.ngxService.stop()
        this.router.navigateByUrl('/admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/categories"]));
       }, (err) => {
        this.ngxService.stop()
        
       });
    }else{
      this.toastr.error('Field should not be empty.');

    }
  }

  updateCat(){
    let {name} = this;
    let data = {"name":name,id:this.catId};
  
    if(name){
      this.ngxService.start()
      this.adminService.updateCategory(data).subscribe((result) => {
        this.modalRefEdit.hide();
        this.ngxService.stop()
        this.router.navigateByUrl('/admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/categories"]));
       }, (err) => {
        this.ngxService.stop()
        
       });
    }else{

      this.toastr.error('Field should not be empty.');
    }

  }
  deleteCat(template:any,id){
    this.id = id
    this.modalRefDel = this.modalService.show(template)
  }
  confirmDelete(){
    this.ngxService.start()
    this.adminService.deleteCat(this.id).subscribe(
      res => {
        this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/categories"]));
        this.modalRefDel.hide();
        this.ngxService.stop()
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
  }

}
