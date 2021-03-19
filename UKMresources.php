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
	wp_enqueue_style( 'jquery-ui-style', PLUGIN_PATH . 'UKMresources/css/jquery-ui-1.7.3.custom.css');
	wp_enqueue_style('UKMresources_wp-admin', PLUGIN_PATH . 'UKMresources/css/UKMresources_wp-admin.css');
	wp_register_style('UKMresources_tabs', PLUGIN_PATH . 'UKMresources/css/UKMresources_tabs.css');
	wp_enqueue_style('UKMresources_tabs');
		
	wp_enqueue_script('jquery');
	wp_enqueue_script('jqueryGoogleUI', '//code.jquery.com/ui/1.11.4/jquery-ui.min.js');
	wp_enqueue_script('wp-admin_smslink', PLUGIN_PATH . 'UKMresources/js/wp-admin.smslink.js');
	
	wp_enqueue_script('UKMresources_wp-admin', PLUGIN_PATH . 'UKMresources/js/UKMresources_wp-admin.js?v2020-09-28');
	wp_enqueue_script('UKMresources', PLUGIN_PATH . 'UKMresources/js/UKMresources.js');

	wp_register_script('handlebars_js', PLUGIN_PATH . 'UKMresources/js/handlebars.js');

	wp_register_script('jQuery-fastlivefilter', PLUGIN_PATH . 'UKMresources/js/jquery.fastLiveFilter.js');
    wp_register_script('jQuery_autogrow', PLUGIN_PATH . 'UKMresources/js/autogrow.jquery.js');

	wp_register_script('bootstrap_js', PLUGIN_PATH . 'UKMresources/js/bootstrap.min.js');
	wp_register_style('bootstrap_css', PLUGIN_PATH . 'UKMresources/css/bootstrap.min.css');
	wp_register_script('WPbootstrap_js', PLUGIN_PATH . 'UKMresources/js/bootstrap.min.js');
	wp_register_style('WPbootstrap_css', PLUGIN_PATH . 'UKMresources/css/bootstrap.min.css');

	wp_register_script('WPbootstrap3_js', PLUGIN_PATH . 'UKMresources/js/bootstrap3.js');
	wp_register_style('WPbootstrap3_css', PLUGIN_PATH . 'UKMresources/css/bootstrap3.css');
	wp_register_style('WPbootstrap3_outlinebtn', PLUGIN_PATH . 'UKMresources/css/bootstrap3.btn-outline.css');
	
	wp_register_script('WPbootstrap4_js', PLUGIN_PATH . 'UKMresources/js/bootstrap4-alpha2.min.js');
	wp_register_style('WPbootstrap4_css', PLUGIN_PATH . 'UKMresources/css/bootstrap4-alpha2.min.css');
    
    wp_enqueue_style('WPgallery_css', PLUGIN_PATH . 'UKMresources/css/gallery.css');
	
    wp_register_script( 'TwigJS', PLUGIN_PATH . 'UKMresources/js/twig.js');
    wp_register_script( 'dropzone', PLUGIN_PATH . 'UKMresources/js/dropzone.js');
}

function UKMconstants() {
    echo '<script type="text/javascript">'.
            'var SEASON = '. get_site_option('season') .';'.
			'var GOOGLE_API_KEY = "'. (defined('GOOGLE_API_KEY') ? GOOGLE_API_KEY : '') .'";' .
			'var UKM_HOSTNAME = "' . UKM_HOSTNAME . '";' . 
        '</script>';
}