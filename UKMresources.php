<?php
/* 
Plugin Name: UKM Resources
Plugin URI: http://www.ukm-norge.no
Description: Resources loaded to admin (javascript, jquery, googlescripts+++)
Author: UKM Norge / M Mandal 
Version: 1.0 
Author URI: http://www.ukm-norge.no
*/


add_action( 'admin_enqueue_scripts', 'UKMresources', -1000 );
add_action( 'admin_print_scripts', 'UKMconstants' );
function UKMresources() {
	wp_enqueue_style( 'jquery-ui-style', plugin_dir_url( __FILE__ ) .'css/jquery-ui-1.7.3.custom.css');
	wp_enqueue_style('UKMresources_wp-admin', plugin_dir_url( __FILE__ ) .'css/UKMresources_wp-admin.css');
	wp_register_style('UKMresources_tabs', plugin_dir_url( __FILE__ ) .'css/UKMresources_tabs.css');
	wp_enqueue_style('UKMresources_tabs');
		
	wp_enqueue_script('jquery');
	wp_enqueue_script('jqueryGoogleUI', '//code.jquery.com/ui/1.11.4/jquery-ui.min.js');
	wp_enqueue_script('wp-admin_smslink', plugin_dir_url( __FILE__ ) .'js/wp-admin.smslink.js');
	
	wp_enqueue_script('UKMresources_wp-admin', plugin_dir_url( __FILE__ ) .'js/UKMresources_wp-admin.js?v2020-09-28');
	wp_enqueue_script('UKMresources', plugin_dir_url( __FILE__ ) .'js/UKMresources.js');

	wp_register_script('handlebars_js', plugin_dir_url( __FILE__ ) .'js/handlebars.js');

	wp_register_script('jQuery-fastlivefilter', plugin_dir_url( __FILE__ ) .'js/jquery.fastLiveFilter.js');
    wp_register_script('jQuery_autogrow', plugin_dir_url( __FILE__ ) .'js/autogrow.jquery.js');

	wp_register_script('bootstrap_js', plugin_dir_url( __FILE__ ) .'js/bootstrap.min.js');
	wp_register_style('bootstrap_css', plugin_dir_url( __FILE__ ) .'css/bootstrap.min.css');
	wp_register_script('WPbootstrap_js', plugin_dir_url( __FILE__ ) .'js/bootstrap.min.js');
	wp_register_style('WPbootstrap_css', plugin_dir_url( __FILE__ ) .'css/bootstrap.min.css');

	wp_register_script('WPbootstrap3_js', plugin_dir_url( __FILE__ ) .'js/bootstrap3.js');
	wp_register_style('WPbootstrap3_css', plugin_dir_url( __FILE__ ) .'css/bootstrap3.css');
	wp_register_style('WPbootstrap3_outlinebtn', plugin_dir_url( __FILE__ ) .'css/bootstrap3.btn-outline.css');
	
	wp_register_script('WPbootstrap4_js', plugin_dir_url( __FILE__ ) .'js/bootstrap4-alpha2.min.js');
	wp_register_style('WPbootstrap4_css', plugin_dir_url( __FILE__ ) .'css/bootstrap4-alpha2.min.css');
	
	
    wp_register_script( 'TwigJS', plugin_dir_url( __FILE__ ) .'js/twig.js');
    wp_register_script( 'dropzone', plugin_dir_url( __FILE__ ) .'js/dropzone.js');
}

function UKMconstants() {
    echo '<script type="text/javascript">'.
            'var SEASON = '. get_site_option('season') .';'.
			'var GOOGLE_API_KEY = "'. (defined('GOOGLE_API_KEY') ? GOOGLE_API_KEY : '') .'";' .
			'var UKM_HOSTNAME = "' . UKM_HOSTNAME . '";' . 
        '</script>';
}