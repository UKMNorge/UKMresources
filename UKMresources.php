<?php
/* 
Plugin Name: UKM Resources
Plugin URI: http://www.ukm-norge.no
Description: Resources loaded to admin (javascript, jquery, googlescripts+++)
Author: UKM Norge / M Mandal 
Version: 1.0 
Author URI: http://www.ukm-norge.no
*/


add_action( 'admin_enqueue_scripts', 'UKMresources' );


function UKMresources() {
	wp_enqueue_style( 'jquery-ui-style', plugin_dir_url( __FILE__ ) .'css/jquery-ui-1.7.3.custom.css');
	wp_enqueue_style('UKMresources_wp-admin', plugin_dir_url( __FILE__ ) .'css/UKMresources_wp-admin.css');
	wp_enqueue_style('UKMresources_tabs', plugin_dir_url( __FILE__ ) .'js/UKMresources_tabs.css');
		
	wp_enqueue_script('jquery');
	wp_enqueue_script('jqueryGoogleUI', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js');
	wp_enqueue_script('wp-admin_smslink', plugin_dir_url( __FILE__ ) .'js/wp-admin.smslink.js');
	
	wp_enqueue_script('UKMresources_wp-admin', plugin_dir_url( __FILE__ ) .'js/UKMresources_wp-admin.js');

	wp_register_script('handlebars_js', plugin_dir_url( __FILE__ ) .'js/handlebars.js');

	wp_register_script('bootstrap_js', plugin_dir_url( __FILE__ ) .'js/bootstrap.min.js');
	wp_register_style('bootstrap_css', plugin_dir_url( __FILE__ ) .'css/bootstrap.min.css');

}